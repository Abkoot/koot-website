import AppKit
let rgb = NSBitmapImageRep(data: try! Data(contentsOf: URL(fileURLWithPath: "src/logo/logo_rgb.jpg")))!
let mask = [UInt8](try! Data(contentsOf: URL(fileURLWithPath: "src/logo/logo_mask.raw")))
let w = 528, h = 228
let out = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
var minX = w, maxX = 0, minY = h, maxY = 0
var hist: [String: Int] = [:]
for y in 0..<h { for x in 0..<w {
  let a = Double(mask[y*w+x]) / 255
  let c = rgb.colorAt(x: x, y: y)!.usingColorSpace(.deviceRGB)!
  func un(_ v: CGFloat) -> CGFloat { a > 0.02 ? min(1, v / CGFloat(a)) : 0 }
  let col = NSColor(deviceRed: un(c.redComponent), green: un(c.greenComponent), blue: un(c.blueComponent), alpha: CGFloat(a))
  out.setColor(col, atX: x, y: y)
  if a > 0.1 { minX = min(minX,x); maxX = max(maxX,x); minY = min(minY,y); maxY = max(maxY,y) }
  if a > 0.98 { let k = String(format:"#%02X%02X%02X", Int(un(c.redComponent)*255/8)*8, Int(un(c.greenComponent)*255/8)*8, Int(un(c.blueComponent)*255/8)*8); hist[k, default: 0] += 1 }
}}
print("bbox", minX, minY, maxX, maxY)
print(hist.sorted { $0.value > $1.value }.prefix(6))
try! out.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "src/logo/logo_full.png"))
