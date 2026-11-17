import AppKit
let rep = NSBitmapImageRep(data: try! Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1])))!
var i = 2
while i + 1 < CommandLine.arguments.count {
  let x = Int(CommandLine.arguments[i])!, y = Int(CommandLine.arguments[i+1])!
  let c = rep.colorAt(x: x, y: y)!.usingColorSpace(.sRGB)!
  print(String(format: "(%d,%d) #%02X%02X%02X", x, y, Int(round(c.redComponent*255)), Int(round(c.greenComponent*255)), Int(round(c.blueComponent*255))))
  i += 2
}
