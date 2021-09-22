module.exports = function AddCart(cartData){ //oldCart,item,allocation,userQty
	var oldCart = cartData.cartData;
	var item = cartData.item;
	var allocation = cartData.allocation;
	var userQty = cartData.userQty;
	var updateQty = cartData.updateQty

	this.items = oldCart.cart || [];
	 if(this.items.length == 0){
		this.items.push({item : item, allocation : allocation, qty : userQty})
	}else{
		var checkIsItemmExist = this.items.filter(obj => (obj.item == item));
		if(checkIsItemmExist.length == 0){
			this.items.push({item : item, allocation : allocation, qty : userQty})
		}else{
			var index = this.items.findIndex(p => p.item == item);
			this.items[index]['qty'] = updateQty ? userQty : this.items[index]['qty']+userQty
		}
	}
	oldCart['cart'] = this.items
	oldCart.total_quantity = this.items.reduce(function(sum, current) {
		return sum + current.qty;
	}, 0);
	return oldCart;
}

