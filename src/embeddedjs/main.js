import Poco from "commodetto/Poco";
import parseBMF from "commodetto/parseBMF";
import parseRLE from "commodetto/parseRLE";

const render = new Poco(screen);

// Load a custom font from BMF resources
function getFont(name, size) {
    const font = parseBMF(new Resource(`${name}-${size}.fnt`));
    font.bitmap = parseRLE(new Resource(`${name}-${size}-alpha.bm4`));
    return font;
}

// Fonts
const timeFont = getFont("Dune_Rise", 56);
const dateFont = getFont("Dune_Rise", 24);
const labelFont = getFont("Dune_Rise", 16);

// Colors
const black = render.makeColor(0, 0, 0);
const white = render.makeColor(255, 255, 255);

// Day and month names for date formatting
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Precompute layout positions
const blockHeight = timeFont.height + dateFont.height + labelFont.height;
const timeY = (render.height - blockHeight) / 2;
const dateY = timeY + timeFont.height;
const labelY = dateY + dateFont.height;

function draw(event) {
    const now = event.date;
    render.begin();
    render.fillRectangle(black, 0, 0, render.width, render.height);

    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    // Draw time centered
    let width = render.getTextWidth(timeStr, timeFont);
    render.drawText(timeStr, timeFont, white,
        (render.width - width) / 2, timeY);

    // Format date as "Mon Jan 01"
    const dayName = DAYS[now.getDay()];
    const monthName = MONTHS[now.getMonth()];
    const dateStr = `${dayName} ${monthName} ${String(now.getDate()).padStart(2, "0")}`;

    // Draw date centered below time
    width = render.getTextWidth(dateStr, dateFont);
    render.drawText(dateStr, dateFont, white,
        (render.width - width) / 2, dateY);

    // Draw "DUNE" label centered below date
    const labelStr = "DUNE";
    width = render.getTextWidth(labelStr, labelFont);
    render.drawText(labelStr, labelFont, white,
        (render.width - width) / 2, labelY);

    render.end();
}

// Update every minute (fires immediately when registered)
watch.addEventListener("minutechange", draw);