class Typography {
    constructor(data) {
        this.name = data.name;
        this.font = data.style;
    }

    get fontFamily() {
        return this.font.fontFamily;
    }

    get fontWeight() {
        return this.font.fontWeight;
    }

    get fontSize() {
        return this.font.fontSize
    }

    get cssVariables() {
        return `$${this.name}: ${this.fontWeight} ${this.fontSize} ${this.fontFamily}`
    }

    get cssValue() {
        return `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`
    }
}

module.exports = Typography;