/** Protein Crunch order backend. Configure both values before deploying. */
const CONFIG = {
  NOTIFICATION_EMAIL: "", // Shop owner's inbox for new order alerts
  SPREADSHEET_ID: "",     // ID from the Google Sheet URL
  SHEET_NAME: "Orders",
  SHOP_PHONE: "7026505626"
};

function doGet() {
  return json_({ok:true, service:"Protein Crunch order backend", message:"Backend is online."});
}

function doPost(e) {
  try {
    const p = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const problem = validate_(p);
    if (problem) return json_({ok:false,error:problem});
    const sheet = getSheet_();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Order ID","Created At","Customer Name","Phone","Delivery Address","Items","Subtotal (INR)","Payment Method","Payment Status","Order Status","Notes","Distance (km)"]);
      sheet.setFrozenRows(1);
      sheet.getRange(1,1,1,12).setFontWeight("bold");
    }
    const now = new Date();
    const id = "PCW-" + Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") + "-" + Math.floor(100 + Math.random()*900);
    const itemText = p.items.map(x => x.quantity + " × " + clean_(x.name,150) + (x.option && x.option !== "Regular" ? " ("+clean_(x.option,50)+")" : "") + " @ ₹" + Number(x.price) + " = ₹" + (Number(x.price)*Number(x.quantity))).join("\n");
    const distance = p.delivery && p.delivery.distanceKm != null ? Number(p.delivery.distanceKm) : "";
    sheet.appendRow([id,now,clean_(p.customer.name,100),clean_(p.customer.phone,30),clean_(p.customer.address,1000),itemText,Number(p.subtotal),"Cash on delivery","Pending","New",clean_(p.customer.notes || "",1000),distance]);
    if (CONFIG.NOTIFICATION_EMAIL) {
      const body = ["New Protein Crunch order request","", "Order ID: "+id,"Customer: "+clean_(p.customer.name,100),"Phone: "+clean_(p.customer.phone,30),"Address: "+clean_(p.customer.address,1000),"","Items:",itemText,"","Subtotal: ₹"+Number(p.subtotal),"Payment: Cash on delivery","Status: New","Notes: "+clean_(p.customer.notes || "",1000),"","Check the private Google Sheet for order management."].join("\n");
      MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL,"New Protein Crunch order — "+id,body);
    }
    return json_({ok:true,orderId:id,message:"Order request saved."});
  } catch (err) {
    return json_({ok:false,error:"Could not save the order. Please call the shop to confirm."});
  }
}

function validate_(p) {
  if (!p || !p.customer || !Array.isArray(p.items) || !p.items.length) return "Order details are incomplete.";
  if (!clean_(p.customer.name,100) || !clean_(p.customer.phone,30) || !clean_(p.customer.address,1000)) return "Name, phone and address are required.";
  if (p.items.length > 60) return "Too many line items.";
  let sum = 0;
  for (const x of p.items) {
    const price = Number(x.price), qty = Number(x.quantity);
    if (!clean_(x.name,150) || !Number.isFinite(price) || price < 0 || !Number.isInteger(qty) || qty < 1 || qty > 99) return "One or more items are invalid.";
    sum += price * qty;
  }
  if (!Number.isFinite(Number(p.subtotal)) || Math.abs(sum - Number(p.subtotal)) > 0.01) return "Order total did not match its items.";
  return "";
}
function getSheet_() {
  if (!CONFIG.SPREADSHEET_ID) throw new Error("Configure SPREADSHEET_ID first.");
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
}
function clean_(v,n) { return String(v == null ? "" : v).replace(/[\r\n\t]+/g," ").trim().slice(0,n); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
