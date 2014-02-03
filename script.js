$(function() {
    var wYearMonth;
    /*
     *   Только нужно сделать так чтобы, если хочешь ввести "6", необязательно вводить "06" (чтоб "6_" или "_6" были валидными)
     *   А также по окончании редактирования поля, форматировать значение (например: "2 года", "10 месяцев", "6 лет 3 месяца", если значение не заполнено, не выводить в поле ничего) 
     *   __лет__месяцев
     */
    wYearMonth = Backbone.View.extend({
        events: {
            'keyup': 'keyup'
        },
        initialize: function(){
            this.el.value = '__лет__месяцев';
            _.bindAll(this, 'keyup');
            console.log(this.$el);
        },
        keyup: function(e){
            var keyCode = e.keyCode || e.which,
                isMonth,
                isYear,
                startPos = this.getCarretPosition(this.el).start,
                result = false;
            if(
                    keyCode == 37||
                    keyCode == 38||
                    keyCode == 39||
                    keyCode == 40
              ){
                result =  this.keyArrow(e);
            } else if( /^\d$/g.test(String.fromCharCode(keyCode)) ){
                isYear = startPos == 1 ||
                          startPos == 2;
                isMonth = startPos == 6 ||
                          startPos == 7;

                this.applyPlaceHolder(isMonth, isYear, keyCode);
                this.setCaretPosition(this.el, startPos);
            } else {
                this.setPreviosState();
                this.setCaretPosition(this.el, startPos-1);
            }
        },
        setPreviosState: function(){
            var startPos = this.getCarretPosition(this.el).start;
            this.el.value = this.el.value.substring(0, startPos-1) + this.el.value.substring(startPos, this.el.value.length);

        },
        applyPlaceHolder: function(isMonth, isYear, keyCode){
            var startPos = this.getCarretPosition(this.el).start,
                that = this;
            //взовращаем строку к первоначальному видо до keyup
            this.setPreviosState();
            this.el.value = this.el.value.replace(/(_)/g, function(month, year, position, text){
                if(position === 0 && isYear && position === (startPos-1) || 
                   position === 1 && isYear && position === (startPos-1) ){
                    return String.fromCharCode(keyCode);
                }
                if(position === 5 && isMonth && position === (startPos-1) || 
                   position === 6 && isMonth && position === (startPos-1) ){
                    return String.fromCharCode(keyCode);
                }

                if(position !== 0 && isYear || 
                   position !== 1 && isYear){
                    return year;
                }
                if(position !== 5 && isMonth || 
                   position !== 6 && isMonth){
                    return month;
                }
            });
        },
        keyArrow: function(){
            
        },
        getCarretPosition: function(el){
            var start = 0, end = 0, normalizedValue, range,
            textInputRange, len, endRange;

            if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
                start = el.selectionStart;
                end = el.selectionEnd;
            } else {
                range = document.selection.createRange();

                if (range && range.parentElement() == el) {
                    len = el.value.length;
                    normalizedValue = el.value.replace(/\r\n/g, "\n");

                    // Create a working TextRange that lives only in the input
                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    // Check if the start and end of the selection are at the very end
                    // of the input, since moveStart/moveEnd doesn't return what we want
                    // in those cases
                    endRange = el.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;

                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }
            }

            return {
                start: start,
                end: end
            };
        },
        setCaretPosition: function(elem, caretPos) {

            if(elem !== null) {
                if(elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                }
                else {
                    if(elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    }
                    else
                        elem.focus();
                }
            }
        }
    });

    test = new wYearMonth({el:'.wYearMonth'});
});

function getInputSelection(el) {
    
}