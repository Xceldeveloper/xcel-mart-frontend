export default {
  methods: {
    formatToCurrency(digit) {
      if(digit === undefined || digit == null || digit == ''){
        return
      }
      // if(digit === null ||digit === undefined || typeof digit == 'string'){
      //   return
      // }
      return digit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    currencyFormatDE(num) {
      return (
        num
        .toFixed(2) // always two decimal digits
        .replace('.', ',') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' €'
      ) // use . as a separator
    },
    copyToClipboard(str) {
      const el = document.createElement('textarea'); // Create a <textarea> element
      el.value = str; // Set its value to the string that you want copied
      el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
      el.style.position = 'absolute';
      el.style.left = '-9999px'; // Move outside the screen to make it invisible
      document.body.appendChild(el); // Append the <textarea> element to the HTML document
      const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ?
        document.getSelection().getRangeAt(0) // Store selection if found
        :
        false; // Mark as false to know no selection existed before
      el.select(); // Select the <textarea> content
      document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
      document.body.removeChild(el); // Remove the <textarea> element
      if (selected) { // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
      }
    },

    
    cancelFullScreen(el = "") {
      var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);
      if (isInFullScreen)
        if (el == "") {
          el = document
        }
      var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen;
      if (requestMethod) { // cancel full screen.
        requestMethod.call(el);
      } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }

    },

    requestFullScreen(el = "") {
      var elem = document.body; // Make the body go full screen.

      if (el == "") {
        el = elem
      }
      // Supports most browsers and their versions.
      var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      if (requestMethod) { // Native full screen.
        requestMethod.call(el);
      } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
          wscript.SendKeys("{F11}");
        }
      }
      return false
    },

    toggleFullScreen() {
      var elem = document.body; // Make the body go full screen.
      var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);
      if (isInFullScreen) {
        this.cancelFullScreen(document);

      } else {
        this.requestFullScreen(elem);
      }
      return false;
    },
  },

}