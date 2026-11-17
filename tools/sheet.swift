import AppKit
let dir = CommandLine.arguments[1]
let files = try! FileManager.default.contentsOfDirectory(atPath: dir).filter { $0.hasSuffix(".jpg") || $0.hasSuffix(".png") }.sorted()
let cols = 4, cell: CGFloat = 360, rows = (files.count + cols - 1) / cols
let img = NSImage(size: NSSize(width: CGFloat(cols) * cell, height: CGFloat(rows) * (cell * 0.8 + 24)))
img.lockFocus(); NSColor.white.setFill(); NSRect(origin: .zero, size: img.size).fill()
for (i, f) in files.enumerated() {
  guard let im = NSImage(contentsOfFile: dir + "/" + f) else { continue }
  let x = CGFloat(i % cols) * cell, y = img.size.height - CGFloat(i / cols + 1) * (cell * 0.8 + 24)
  let s = min((cell - 10) / im.size.width, cell * 0.8 / im.size.height)
  im.draw(in: NSRect(x: x + 5, y: y + 24, width: im.size.width * s, height: im.size.height * s))
  (f as NSString).draw(at: NSPoint(x: x + 5, y: y + 4), withAttributes: [.font: NSFont.systemFont(ofSize: 13)])
}
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[2]))
