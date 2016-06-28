(function() {

    var PRELOADED_SCREENS = 5;
    var ITEM_LIMIT_PER_REQUEST = 10;
    var DATA_ENDPOINT = '/data.php';
    var MILLISECONDS_GIVEN = 2 * 60 * 1000;

    var deferLoadNextPage = _.debounce(_.defer.bind(null, loadNextPage), 1000);

    // Updated with the cursor to the next page of items in the data api.
    var next = null;
    var loadedItemCache = {};
    var startTime = null;
    var running = false;

    var itemsDiv = document.getElementById('items');
    var startOverlay = document.getElementById('start');
    var endOverlay = document.getElementById('end');
    var startButton = document.getElementById('start-button');
    var resultsButton = document.getElementById('results-button');
    var clock = document.getElementById('clock');    

    window.itemsApp = LearnosityItems.init(ITEM_API_INIT_OPTS, {
        readyListener: watchScrolling
    });

    $(setup);

    function setup() {
        startButton.addEventListener('click', start);
        resultsButton.addEventListener('click', results);
        clock.textContent = moment(MILLISECONDS_GIVEN).format('m:ss');
    }

    function start() {
        $(startOverlay).hide();
        startTime = Date.now();
        running = true;
        updateClock();
    }

    function stop() {
        $(endOverlay).show();
        running = false;
    }

    function updateClock() {
        if (running) {
        var endTime = startTime + MILLISECONDS_GIVEN;
        var timeRemaining = endTime - Date.now();
            if (timeRemaining <= 0) {
                stop();
            } else {
                clock.textContent = moment(timeRemaining).format('m:ss');
                window.requestAnimationFrame(updateClock);
            }
        }
    }

    function results() {
        document.location.href = '/report.php?userid=' +
            ITEM_API_INIT_OPTS.security.user_id +
            '&sessid=' +
            ITEM_API_INIT_OPTS.request.session_id;
    }

    function watchScrolling() {
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
        for (var i = 0; i < allItems.length; i++) {
            allRefs.push(allItems[i].getAttribute('data-reference'));
        }

        return allRefs;
    }

    function makeItemSpan(ref) {
        var itemSpan = document.createElement('span');
        itemSpan.setAttribute('class', 'learnosity-item');
        itemSpan.setAttribute('data-reference', ref);

        return itemSpan;
    }

})();
