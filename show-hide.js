/*
 @preserve
 * jQuery Show/Hide v1.0 - Show or Hide elements on the page
 * https://github.com/jquery/jquery-show-hide
 *
 * Copyright 2016 Ashley Needham
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Sun February 7th 2016
 *
 * Show or Hide elements when clicking or changing the elements passed in the selector.
 */

(function($) {

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
            obj = this.filter('a, input, textarea, select');

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
                        run(show, hide);
                    }
                });
            } else if (elTag === 'SELECT') {
                /**
                 * For select lists we need to switch the el with the selected option
                 */
                var el = ($(this).children(':selected').length > 0 ? $(this).children(':selected') : $(this).children().first()),
                    hide = el.data('hide'),
                    show = el.data('show');

                $(this).on('change', function(e) {
                    console.log('Element changed');
                    var el = ($(this).children(':selected').length > 0 ? $(this).children(':selected') : $(this).children().first());
                        hide = el.data('hide'),
                        show = el.data('show');

                    reply = settings.callbackOnTrigger(el, show, hide, elTag, elType);
                    console.log('REPLY = ' + reply);
                    if (reply) {
                        run(show, hide);
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
                        run(show, hide);
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
         * @param show  A jquery object of elements to show
         * @param hide  A jquery object of elements to hide
         */
        function run(show, hide) {
            console.log('showHide.Run started');
            if (settings.toggleElements) {
                console.log('showHide.toggle');

                // Check for show & hide selector strings
                if (show === '') {
                    // No show elements so we toggle the hide elements
                    $(hide).slideToggle(settings.transitionSpeed);
                } else if (hide === '') {
                    // No hide elements so we toggle the show elements
                    $(show).slideToggle(settings.transitionSpeed);
                } else {
                    // Both show and hide elements exist so we toggle each
                    $(show + ',' + hide).slideToggle(settings.transitionSpeed);
                }
            } else {
                console.log('showHide.standard');
                if (settings.runWhichEventFirst === 'show') {
                    console.log('showHide.standard.showFirst');
                    if (!$(show).is(':visible')) {
                        /* If show element is NOT visible */
                        $(show).slideDown(settings.transitionSpeed, function () {
                            if ($(hide).is(':visible')) {
                                $(hide).slideUp(settings.transitionSpeed);
                            }
                        });
                    } else {
                        /* If show element IS visible then we don't need to show it */
                        if ($(hide).is(':visible')) {
                            $(hide).slideUp(settings.transitionSpeed);
                        }
                    }
                } else if (settings.runWhichEventFirst === 'hide') {
                    console.log('showHide.standard.hideFirst');
                    if ($(hide).is(':visible')) {
                        /* If the hide element IS visible */
                        $(hide).slideUp(settings.transitionSpeed, function () {
                            if (!$(show).is(':visible')) {
                                $(show).slideDown(settings.transitionSpeed);
                            }
                        });
                    } else {
                        /* If the hide element is NOT visible then we don't need to hide it */
                        if (!$(show).is(':visible')) {
                            $(show).slideDown(settings.transitionSpeed);
                        }
                    }
                } else {
                    console.log('showHide.standard.showHideSimultaneous');
                    if (!$(show).is(':visible')) {
                        $(show).slideDown(settings.transitionSpeed);
                    }
                    if ($(hide).is(':visible')) {
                        $(hide).slideUp(settings.transitionSpeed);
                    }
                }
            }
        }
    };
}(jQuery));
