module.exports = function AddCart(oldCart,item,allocation){
	this.items = oldCart.cart || [];
	 if(this.items.length == 0){
		this.items.push({item : item, allocation : allocation, qty : oldCart.qty})
	}else{
		this.items.filter((obj) =>{
			if(obj.item == item){
				obj.qty = obj.qty+oldCart.total_quantity;
			}else{
				this.items.push({item : item, allocation : allocation, qty : oldCart.qty})
			}
		})
	}
	oldCart['cart'] = this.items
	oldCart.total_quantity = this.items.reduce(function(sum, current) {
		return sum + current.qty;
	}, 0);
	return oldCart;
}