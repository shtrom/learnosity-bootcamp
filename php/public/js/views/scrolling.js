(function() {

    var PRELOADED_SCREENS = 5;
    var ITEM_LIMIT_PER_REQUEST = 10;
    var DATA_ENDPOINT = '/data.php';

    var deferLoadNextPage = _.debounce(_.defer.bind(null, loadNextPage), 1000);

    // Updated with the cursor to the next page of items in the data api.
    var next = null;
    var loadedItemCache = {};

    var itemsDiv = document.getElementById('items');
    window.itemsApp = LearnosityItems.init(ITEM_API_INIT_OPTS, {
        readyListener: main
    });

    function main() {
        window.addEventListener('scroll', loadCheck);
        initItemCache();
        loadCheck();
    }

    function initItemCache() {
        var loadedItems = currentlyLoadedItems();
        for (var i = 0; i < loadedItems.length; i++) {
            loadedItemCache[loadedItems[i]] = true;
        }
    }

    function loadCheck() {
        if (shouldLoadMore()) {
            deferLoadNextPage();
        }
    }

    function shouldLoadMore() {
        var screenTop = window.pageYOffset;
        var bottom = document.documentElement.offsetHeight;
        var chunkSize = window.innerHeight * PRELOADED_SCREENS;

        return screenTop > bottom - chunkSize;
    }

    function loadNextPage() {
        if (next === false) {
            return;
        }

        var dataPrms = {limit: ITEM_LIMIT_PER_REQUEST};
        if (next) {
            dataPrms.next = next;
        }

        $.get(DATA_ENDPOINT, dataPrms).then(function (res) {
            var items = _.pluck(res.data, 'reference');
            appendItems(items);
            next = res.meta.next;
            if (next) {
                loadCheck();
            } else {
                next = false;
            }
        });
    }

    function appendItems(items) {
        items = deduplicate(items);

        if (items.length) {
            for (var i = 0; i < items.length; ++i) {
                var span = makeItemSpan(items[i]);
                itemsDiv.appendChild(span);
            }

            itemsApp.addItems({
                items: items,
                removePreviousItems: false
            });
        }
    }

    function deduplicate(items) {
        var deduplicatedItems = [];
        for (var i = 0; i < items.length; i++) {
            if (!loadedItemCache[items[i]]) {
                deduplicatedItems.push(items[i]);
            }
        }
        return deduplicatedItems;
    }

    function currentlyLoadedItems() {
        var allItems = document.querySelectorAll('.learnosity-item');
        var allRefs = [];
        allItems.forEach(function (item) {
            allRefs.push(item.getAttribute('data-reference'));
        });

        return allRefs;
    }

    function makeItemSpan(ref) {
        var itemSpan = document.createElement('span');
        itemSpan.setAttribute('class', 'learnosity-item');
        itemSpan.setAttribute('data-reference', ref);

        return itemSpan;
    }

})();
