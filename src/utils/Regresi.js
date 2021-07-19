export default class Regresi {
    constructor(datasets, labelX, labelY) {
        this.datasets = datasets
        this.labelX = labelX
        this.labelY = labelY
    }

    get dataX() {
        const x = this.datasets.map((element) => element.x)
        return x
    }

    get dataY() {
        const y = this.datasets.map((element) => element.y)
        return y
    }

    sigma(datasets, power = 0) {
        let sum = 0
        if (power == 0) {
            sum = datasets.reduce((total, dataset) => {
                return total + dataset
            }, 0)
        } else {
            sum = datasets.reduce((total, dataset) => {
                return total + Math.pow(dataset, power)
            }, 0)
        }
        return sum
    }

    sigma_xy() {
        let sigma = 0
        this.dataX.forEach((x, index) => {
            sigma += x * this.dataY[index]
        })
        return sigma
    }

    intercept() {
        const upper = (this.sigma(this.dataY) * this.sigma(this.dataX, 2)) - (this.sigma(this.dataX) * this.sigma_xy())
        const bottom = this.dataX.length * this.sigma(this.dataX, 2) - Math.pow(this.sigma(this.dataX), 2)
        return upper / bottom
    }

    slope() {
        const upper = (this.dataX.length * this.sigma_xy()) - (this.sigma(this.dataX) * this.sigma(this.dataY))
        const bottom = (this.dataX.length * this.sigma(this.dataX, 2)) - Math.pow(this.sigma(this.dataX), 2)
        return upper / bottom
    }

    predict(x) {
        return this.intercept() + this.slope() * x;
    }

    model_formula() {
        let sign = (this.slope() < 0) ? "-" : "+"
        return `Y = ${this.round_decimal(this.intercept())} ${sign} ${this.round_decimal(Math.abs(this.slope()))} X`
    }

    round_decimal(number) {
        return Math.round((number + Number.EPSILON) * 100) / 100
    }

    correlation() {
        // correlation value
        let upper = (this.dataX.length * this.sigma_xy()) - (this.sigma(this.dataX) * this.sigma(this.dataY))
        let bottom_1 = (this.dataX.length * this.sigma(this.dataX, 2) - Math.pow(this.sigma(this.dataX), 2))
        let bottom_2 = (this.dataX.length * this.sigma(this.dataY, 2)) - Math.pow(this.sigma(this.dataY), 2)
        let bottom = Math.sqrt(bottom_1 * bottom_2)
        const value = upper / bottom

        // correlation type
        const type = (value < 0) ? "negatif" : "positif"

        // correlation power
        const power = (value) => {
            if (Math.abs(value) < 0.2) return "sangat lemah"
            else if (Math.abs(value) >= 0.2 && Math.abs(value) < 0.4) return "lemah"
            else if (Math.abs(value) >= 0.4 && Math.abs(value) < 0.6) return "sedang"
            else if (Math.abs(value) >= 0.6 && Math.abs(value) < 0.8) return "kuat"
            else if (Math.abs(value) >= 0.8 && Math.abs(value) <= 1) return "sangat kuat"
            else return "undefined"
        }

        return {
            value,
            type,
            power: power(value)
        }
    }

    koef_determination() {
        const { value } = this.correlation()
        return this.round_decimal(Math.pow(value, 2)) * 100
    }

    another_factor() {
        return this.round_decimal(100 - this.koef_determination())
    }
}