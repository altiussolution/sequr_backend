module.exports = function AddKit(kitData){ //oldCart,item,allocation,userQty
	var oldKit = kitData.kitData;
	var kit_id = kitData.kit_id;
	var item_quantity = kitData.item_quantity;
	var qty = kitData.qty;
	//var updateQty = cartData.updateQty

	this.items = oldKit.kit || [];
	 if(this.items.length == 0){
		this.items.push({kit_id : kit_id, item_quantity : item_quantity, qty : qty, kit_status : 1})
	}else{
		var checkIsItemmExist = this.items.filter(obj => (obj.kit_id == kit_id && obj.kit_status == 1));
		
		if(checkIsItemmExist.length == 0){
			this.items.push({kit_id : kit_id, item_quantity : item_quantity, qty : qty, kit_status : 1})
		}
		// else{
		// 	var index = this.items.findIndex(p => p.kit_id == kit_id && p.kit_status == 1);
		// 	this.items[index]['qty'] = updateQty ? userQty : this.items[index]['qty']+userQty
		// }
	}
	oldKit['kit'] = this.items
	// data.total_quantity = data.cart.reduce((acc, curr) => acc + curr.qty, 0); // 6; current.cart_status == 1
	oldKit.total_quantity = this.items.reduce(function(sum, current) {
		return current.kit_status == 1 ? sum + current.qty : sum;
	}, 0);
	return oldKit;
}