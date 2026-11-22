import AppKit
import Vision
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let source = CGImageSourceCreateWithURL(input as CFURL, nil)!
let image = CGImageSourceCreateImageAtIndex(source, 0, nil)!
let handler = VNImageRequestHandler(cgImage: image)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else { fatalError("No foreground found") }
let instanceMask = result.instanceMask
CVPixelBufferLockBaseAddress(instanceMask, .readOnly)
let maskWidth = CVPixelBufferGetWidth(instanceMask)
let maskHeight = CVPixelBufferGetHeight(instanceMask)
let maskStride = CVPixelBufferGetBytesPerRow(instanceMask)
let labels = CVPixelBufferGetBaseAddress(instanceMask)!.assumingMemoryBound(to: UInt8.self)
let pointX = Double(args[3])!, pointY = Double(args[4])!
let instance = Int(labels[Int(Double(maskHeight) * pointY) * maskStride + Int(Double(maskWidth) * pointX)])
CVPixelBufferUnlockBaseAddress(instanceMask, .readOnly)
guard instance > 0 else { fatalError("Selected point is not foreground") }
let mask = try result.generateScaledMaskForImage(forInstances: IndexSet(integer: instance), from: handler)
CVPixelBufferLockBaseAddress(mask, .readOnly)
defer { CVPixelBufferUnlockBaseAddress(mask, .readOnly) }
let w = image.width, h = image.height, row = w * 4
let rgba = UnsafeMutablePointer<UInt8>.allocate(capacity: row * h)
defer { rgba.deallocate() }
let color = CGColorSpace(name: CGColorSpace.sRGB)!
let context = CGContext(data: rgba, width: w, height: h, bitsPerComponent: 8, bytesPerRow: row, space: color, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
context.draw(image, in: CGRect(x: 0, y: 0, width: w, height: h))
let alpha = CVPixelBufferGetBaseAddress(mask)!
let floatMask = CVPixelBufferGetPixelFormatType(mask) == kCVPixelFormatType_OneComponent32Float
let alphaStride = CVPixelBufferGetBytesPerRow(mask)
var minX = w, minY = h, maxX = 0, maxY = 0
for y in 0..<h {
    for x in 0..<w {
        let value: UInt8 = floatMask
            ? UInt8(max(0, min(255, alpha.advanced(by: y * alphaStride).assumingMemoryBound(to: Float.self)[x] * 255)).rounded())
            : alpha.assumingMemoryBound(to: UInt8.self)[y * alphaStride + x]
        let i = y * row + x * 4
        // Only transparency changes. Interior RGB pixels remain untouched.
        for c in 0..<3 { rgba[i+c] = UInt8((Int(rgba[i+c]) * Int(value) + 127) / 255) }
        rgba[i+3] = value
        if value > 12 { minX = min(minX,x); minY = min(minY,y); maxX = max(maxX,x); maxY = max(maxY,y) }
    }
}
guard minX <= maxX && minY <= maxY else { fatalError("Empty alpha mask: format \(CVPixelBufferGetPixelFormatType(mask))") }
let margin = 12
let crop = CGRect(x: max(0,minX-margin), y: max(0,minY-margin), width: min(w-1,maxX+margin)-max(0,minX-margin)+1, height: min(h-1,maxY+margin)-max(0,minY-margin)+1)
let final = context.makeImage()!.cropping(to: crop)!
let destination = CGImageDestinationCreateWithURL(output as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(destination, final, nil)
guard CGImageDestinationFinalize(destination) else { fatalError("Cannot write PNG") }
print("Saved \(output.lastPathComponent): \(final.width)x\(final.height); original RGB retained inside subject; instance \(instance); crop \(crop)")
