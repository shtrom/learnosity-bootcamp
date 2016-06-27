(function() {

    var itemsDiv = document.getElementById('items');

    var itemsApp = LearnosityItems.init(ITEM_API_INIT_OPTS, {
        readyListener: main
    });

    function main() {
        addItem('mfom_bootcamp_chess');
        addItem('mfom_bootcamp_poker');
        addItem('mfom_bootcamp_code');
        addItem('mfom_bootcamp_foosball');
    }

    function addItem(ref) {
        var span = makeItemSpan(ref);
        itemsDiv.appendChild(span);
        return itemsApp.addItems({
            items: [ref],
            removePreviousItems: false
        });
    }

    function makeItemSpan(ref) {
        var itemSpan = document.createElement('span');
        itemSpan.setAttribute('class', 'learnosity-item');
        itemSpan.setAttribute('data-reference', ref);

        return itemSpan;
    }

})();
