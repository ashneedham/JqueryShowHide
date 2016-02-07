(function($) {
    /**
     * Show/Hide plugin will show specified elements when triggered by the selector elements
     *
     * @param options
     * @returns {*}
     */

    $.fn.showHide = function(options) {
        var settings = $.extend({
            transitionSpeed: 300,
            toggleElements: false,
            displayShowElementsOnLoad: false,
            displayHideElementsOnLoad: true,
            preventDefaultEvent: true,
            runWhichEventFirst: '',
            callbackOnLoad: function(){ return true; },
            callbackOnTrigger: function(){ return true; }
        }, options),
            obj = this.filter('a, input, textarea, select, option');

        return obj.each(function() {
            var el = $(this),
                hide = el.data('hide'),
                show = el.data('show'),
                elTag = el.prop('tagName'),
                elType = el.prop('type'),
                reply = false;

            console.log('Tag: ' + elTag + ' | Type: ' + elType);
            if (elTag === 'INPUT' && elType !== 'button' && elType !== 'reset' && elType !== 'submit') {
                console.log('showHide.setupOnChange');
                /** Attach events **/
                el.on('change', function(e) {
                    console.log('Element changed');
                    reply = settings.callbackOnTrigger(el, show, hide, elTag, elType);
                    console.log('REPLY = ' + reply);
                    if (reply) {
                        run($(this), show, hide);
                    }
                });
            } else {
                console.log('showHide.setupOnClick');
                el.on('click', function (e) {
                    if (settings.preventDefaultEvent) {
                        e.preventDefault();
                    }
                    console.log('Element clicked');
                    reply = settings.callbackOnTrigger(el, show, hide, elTag, elType);
                    if (reply) {
                        run($(this), show, hide);
                    }
                });
            }

            /** Check for initial state **/
            if (settings.displayShowElementsOnLoad === false) {
                console.log('showHide.hideShowElements');
                $(show).hide();
            }
            if (settings.displayHideElementsOnLoad === false) {
                console.log('showHide.hideHideElements');
                $(hide).hide();
            }

            /** Run onLoad Callback **/
            settings.callbackOnLoad(el, show, hide, elTag, elType);
        });

        /**
         * Execute show/hide
         *
         * @param el    The element to work with
         * @param show  A jquery object of elements to show
         * @param hide  A jquery object of elements to hide
         */
        function run(el, show, hide) {
            console.log('showHide.Run started');
            if (settings.toggleElements) {
                console.log('showHide.toggle');

                // Check for show & hide selector strings
                if (show === '') {
                    // No show elements so we toggle the hide elements
                    $(hide).slideToggle(settings.transitionSpeed, function() {
                        if (settings.toggleText) {
                            toggleText(el);
                        }
                    });
                } else if (hide === '') {
                    // No hide elements so we toggle the show elements
                    $(show).slideToggle(settings.transitionSpeed, function() {
                        if (settings.toggleText) {
                            toggleText(el);
                        }
                    });
                } else {
                    // Both show and hide elements exist so we toggle each
                    $(show + ',' + hide).slideToggle(settings.transitionSpeed, function() {
                        if (settings.toggleText) {
                            toggleText(el);
                        }
                    });
                }
            } else {
                console.log('showHide.standard');
                if (settings.runFirst === 'show') {
                    console.log('showHide.standard.showFirst');
                    $(show).slideDown(settings.transitionSpeed, function() {
                        $(hide).slideUp(settings.transitionSpeed);
                    });
                } else if (settings.runFirst === 'hide') {
                    console.log('showHide.standard.hideFirst');
                    $(hide).slideUp(settings.transitionSpeed, function() {
                        $(show).slideDown(settings.transitionSpeed);
                    });
                } else {
                    console.log('showHide.standard.showHideSimultaneous');
                    $(show).slideDown(settings.transitionSpeed);
                    $(hide).slideUp(settings.transitionSpeed);
                }
            }
        }
    };

}(jQuery));