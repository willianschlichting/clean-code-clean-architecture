export default class FreightCalculator {

	static calculate (product: any, distance: number = 1000) {
		console.log('distance: ' + distance);
		const volume = (product.width/100) * (product.height/100) * (product.length/100);
		const density = parseFloat(product.weight)/volume;
		const itemFreight = distance * volume * (density/100);
		return (itemFreight >= 10) ? itemFreight : 10;
	}
}
