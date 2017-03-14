class Pizza {
  static sizes = ['7″', '10″']

  static whoLovesPizzas() {
    return 'Everybody'
  }

  constructor() {
    this._ingredients = ['cheese']
  }

  get ingredients() {
    return this._ingredients
  }

  set ingredients(coolStuff) {
    this._ingredients = coolStuff
  }
}

