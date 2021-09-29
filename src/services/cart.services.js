module.exports = function AddCart(cartData){ //oldCart,item,allocation,userQty
	var oldCart = cartData.cartData;
	var item = cartData.item;
	var allocation = cartData.allocation;
	var userQty = cartData.userQty;
	var updateQty = cartData.updateQty

	this.items = oldCart.cart || [];
	 if(this.items.length == 0){
		this.items.push({item : item, allocation : allocation, qty : userQty, cart_status : 1})
	}else{
		var checkIsItemmExist = this.items.filter(obj => (obj.item == item && obj.cart_status == 1));
		
		if(checkIsItemmExist.length == 0){
			this.items.push({item : item, allocation : allocation, qty : userQty, cart_status : 1})
		}
		else{
			var index = this.items.findIndex(p => p.item == item && p.cart_status == 1);
			this.items[index]['qty'] = updateQty ? userQty : this.items[index]['qty']+userQty
		}
	}
	oldCart['cart'] = this.items
	// data.total_quantity = data.cart.reduce((acc, curr) => acc + curr.qty, 0); // 6; current.cart_status == 1
	oldCart.total_quantity = this.items.reduce(function(sum, current) {
		return current.cart_status == 1 ? sum + current.qty : sum;
	}, 0);
	return oldCart;
}

