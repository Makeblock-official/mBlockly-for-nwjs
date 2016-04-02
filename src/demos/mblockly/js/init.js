/*---------------------- init --------------------------*/
  var blocklyDiv = document.getElementById('blocklyDiv');
  var workspace = Blockly.inject(blocklyDiv, {
      media: '../../media/',
      toolbox: document.getElementById('toolbox')
  });

  var onresize = function(e) {
      document.body.style.height = window.innerHeight + 'px';
  };
  window.addEventListener('resize', onresize, false);
  onresize();

