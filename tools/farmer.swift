import AppKit
let rep = NSBitmapImageRep(data: try! Data(contentsOf: URL(fileURLWithPath: "src/catalogue-img/obj016_930x815.jpg")))!
let w = rep.pixelsWide, h = rep.pixelsHigh
func rgb(_ x: Int, _ y: Int) -> (Double, Double, Double) { let c = rep.colorAt(x: x, y: y)!.usingColorSpace(.sRGB)!; return (Double(c.redComponent), Double(c.greenComponent), Double(c.blueComponent)) }
// background = average of a corner patch
var br = 0.0, bg = 0.0, bb = 0.0, n = 0.0
for y in 5..<25 { for x in 5..<25 { let c = rgb(x, y); br += c.0; bg += c.1; bb += c.2; n += 1 } }
let bgc = (br/n, bg/n, bb/n)
func dist(_ a: (Double, Double, Double)) -> Double { let d = (a.0-bgc.0, a.1-bgc.1, a.2-bgc.2); return (d.0*d.0 + d.1*d.1 + d.2*d.2).squareRoot() }
var maxd = 0.0, ref = bgc
for y in stride(from: 0, to: h, by: 2) { for x in stride(from: 0, to: w, by: 2) { let c = rgb(x, y); let d = dist(c); if d > maxd { maxd = d; ref = c } } }
var ds: [Double] = []
for y in stride(from: 0, to: h, by: 2) { for x in stride(from: 0, to: w, by: 2) { let d = dist(rgb(x, y)); if d > 0.12 { ds.append(d) } } }
ds.sort()
let scale = ds.isEmpty ? maxd : ds[Int(Double(ds.count) * 0.6)]
print("bg", bgc, "line pixels", ds.count, "scale", scale)
let out = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: w, pixelsHigh: h, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
let lr = 0.89, lg = 0.57, lb = 0.30   // brand orange #E3914D
let buf = out.bitmapData!
for y in 0..<h { for x in 0..<w {
  var a = min(1, dist(rgb(x, y)) / scale)
  if a < 0.07 { a = 0 }
  let i = y * out.bytesPerRow + x * 4   // premultiplied RGBA
  buf[i] = UInt8(lr * a * 255); buf[i+1] = UInt8(lg * a * 255); buf[i+2] = UInt8(lb * a * 255); buf[i+3] = UInt8(a * 255)
} }
try! out.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "src/tmp/farmer.png"))
