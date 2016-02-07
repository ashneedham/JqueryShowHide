(function($) {

    $.fn.showHide = function(options) {
        var settings = $.extend({
            transitionSpeed: 300,
            toggleText: false,
            toggleElements: false,
            displayShowElementsOnLoad: false,
            displayHideElementsOnLoad: true,
            preventDefaultEvent: true,
            callbackOnLoad: function(){ return true; },
            callbackOnTrigger: function(){ return true; }
        }, options),
            obj = this.filter('a, input, textarea, select, option');

        return obj.each(function() {
            var el = $(this),
                hide = el.data('hide'),
                show = el.data('show'),
                runFirst = el.data('run-first'),
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
                    if (reply) {
                        run($(this), show, hide, runFirst);
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
                        run($(this), show, hide, runFirst);
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
         * @param runFirst  Which to command to run first (show or hide)
         */
        function run(el, show, hide, runFirst) {
            console.log('showHide.Run started');
            if (show == hide) {
                console.log('showHide.toggle');
                // If show and hide elements are the same then toggle
                $(show).slideToggle(settings.transitionSpeed, function() {
                    if (settings.toggleText) {
                        toggleText(el);
                    }
                });
            } else {
                if (runFirst === 'show') {
                    $(show).slideDown(settings.transitionSpeed, function() {
                        $(hide).slideUp(settings.transitionSpeed);
                        if (settings.toggleText) {
                            $.fn.showHide.toggleText(el);
                        }
                    });
                } else if (runFirst === 'hide') {
                    $(hide).slideUp(settings.transitionSpeed, function() {
                        $(show).slideDown(settings.transitionSpeed);
                        if (settings.toggleText) {
                            $.fn.showHide.toggleText(el);
                        }
                    });
                } else {
                    console.log('showHide.showHideSimultaneous');
                    $(show).slideDown(settings.transitionSpeed);
                    $(hide).slideUp(settings.transitionSpeed);
                    if (settings.toggleText) {
                        $.fn.showHide.toggleText(el);
                    }
                }
            }
        }

        /**
         * Toggle element text
         *
         * @param el The element to process
         */
        function toggleText(el) {
            var altText = el.data('alt-text'),
                currentText = '',
                valAttr = el.val();

            // Determine if we have a value
            if (typeof valAttr !== typeof undefined && valAttr !== false) {
                currentText = el.val();
                el.val(altText);
            } else {
                currentText = el.html();
                el.html(altText);
            }

            // Swap the alt text
            el.data('alt-text', currentText);
        }
    };

}(jQuery));