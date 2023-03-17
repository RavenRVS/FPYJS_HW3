class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    };

    setAvailable(available) {
        this.available = available;
    };
};

class GoodList {

    #goods;

    constructor(sortPrice, sortDir) {
        this.#goods = [];
        this.filter = /./i;      // регулярное выражение используемое для фильтрации товаров по полю name
        this.sortPrice = sortPrice;   // булево значение, признак включения сортировки по полю Price
        this.sortDir = sortDir;    //булево значение, признак направления сортировки по полю Price (true - по возрастанию, false - по убыванию)
    };

    get list() { //возвращает массив доступных для продажи товаров в соответствии с установленным фильтром и сортировкой по полю Price
        let filtredGoods = this.#goods.filter(Good => this.filter.test(Good.name)); 
        if (this.sortPrice && this.sortDir) {
            let sorted = filtredGoods.sort((a, b) => a.price > b.price ? 1 : -1);
            return sorted;
        } else if ((this.sortPrice && !this.sortDir)) {
            let sorted = filtredGoods.sort((a, b) => a.price > b.price ? -1 : 1);
            return sorted;
        } else {
            return filtredGoods
        }
    };

    add(newGood) { //добавление товара в каталог
        this.#goods.push(newGood); 
    };

    remove(id) { //удаление товара из каталога по его id
        for (let i = 0; i < this.#goods.length; i++) {
            if (this.#goods[i].id == id) {
                this.#goods.splice(i, 1);
                return true;
            }
        } return false;
    };
};

class BasketGood extends Good {
    constructor(Good, amount) {
        super(Good.id, Good.name, Good.description, Good.sizes, Good.price, Good.available);
        this.amount = amount;
    };
};

class Basket {
    constructor() {
        this.goods = []
    };

    get totalAmount() { //возвращает общее количество товаров в корзине
        let result = this.goods.reduce((total, BasketGood) => total + BasketGood.amount, 0);
        return result
    };

    get totalSum() {  //возвращает общую стоимость товаров в корзине
        let result = this.goods.reduce((total, BasketGood) => total + (BasketGood.amount * BasketGood.price), 0);
        return result
    };

    add(good, amount) {//Добавляет товар в корзину, если товар уже есть увеличивает количество
        for (let i = 0; i < this.goods.length; i++) {
            if (good.id == this.goods[i].id) {
                this.goods[i].amount += amount;
                return true
            }
        };
        this.goods.push(new BasketGood(good, amount));
    };

    remove(good, amount) { //Уменьшает количество товара в корзине, если количество становится равным нулю, товар удаляется
        for (let i = 0; i < this.goods.length; i++) {
            if (good.id == this.goods[i].id) {
                if (amount < this.goods[i].amount) {
                    this.goods[i].amount += -amount;
                    return true
                } else {
                    this.goods.splice(i, 1);
                    return true
                }
            };
        };
        return false
    };

    clear() {
        if (this.goods.length > 0) {
            this.goods.splice(0, this.goods.length)
            return true;
        } else {
            return false;
        }
    };              //Очищает содержимое корзины
    
    removeUnavailable() {  //Удаляет из корзины товары, имеющие признак available === false (использовать filter())
        let result = this.goods.filter(BasketGood => BasketGood.available == true);
        return result
    }; 
};

const product1 = new Good('1', 'Джинсы', 'Синие джинсы поплулярного производителя', ['S', 'M', 'L',], 3500, false);
const product2 = new Good('2', 'Рубашка', 'Рубашка с длинными рукавами', ['48', '50', '52',], 2500, true);
const product3 = new Good('3', 'Свитер','Классический свитер с оленями', [ 'M', 'L',], 5000, true);
const product4 = new Good('4', 'Куртка','Демисезонная кожаная куртка', ['48', '50',], 12500, true);
const product5 = new Good('5', 'Пиджак','Модный пиджак с карманами', [ 'S', 'L',], 8500, true);

const catalog = new GoodList(false, false);

catalog.add(product1);
catalog.add(product2);
catalog.add(product3);
catalog.add(product4);
catalog.add(product5);
// console.log(catalog.list)

catalog.remove(5)
// console.log(catalog.list)

const myBasket = new Basket();
myBasket.add(product4, 1);
myBasket.add(product1, 2);
myBasket.add(product2, 3);
myBasket.add(product4, 4);
// console.log(myBasket);

myBasket.remove(product4, 3);
myBasket.remove(product2, 3);
//console.log(myBasket);

console.log(myBasket.totalAmount);
console.log(myBasket.totalSum);

product1.setAvailable(false)

console.log(myBasket.removeUnavailable());

myBasket.clear()
// console.log(myBasket);

