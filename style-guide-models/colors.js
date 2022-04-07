class Color {
    constructor(data) {
        this.data = data;
        this.name = data.name.replace(/\s+/g, '-').toLowerCase();
        if (data.fills && data.fills[0].type === 'SOLID') {
            this.rgba = {
                r: this.rgbToInt(data.fills[0].color.r),
                g: this.rgbToInt(data.fills[0].color.g),
                b: this.rgbToInt(data.fills[0].color.b),
                a: data.fills[0].color.a
            }
        }
    }
    
    get hex() { 
        if (!(this.rgba.r != undefined && this.rgba.g != undefined && this.rgba.b != undefined)) {
            return null
        }
        return this.rgbToHex(this.rgba.r, this.rgba.g, this.rgba.b)
    }
    
    get cssColor() {
        if (this.rgba && this.rgba.a < 1) {
            return `rgba(${this.hex}, ${this.rgba.a.toFixed(2)})`
        } else {
            return this.hex
        }
    }

    get cssVariables() {
        return `$${this.name}: ${this.cssColor}`
    }

    rgbToInt(value) { return Math.round(value * 255) }

    intToHex(int) { 
        const hex = Number(int).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r,g,b) {
        const red = this.intToHex(r);
        const green = this.intToHex(g);
        const blue = this.intToHex(b);
        return "#"+red+green+blue;
    }
}

module.exports = Color;