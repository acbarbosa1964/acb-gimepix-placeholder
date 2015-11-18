define(function (require, exports, module) {
    var ExtensionUtils = brackets.getModule('utils/ExtensionUtils'),
        iconService = require('./services/icon'),
        modalService = require('./services/modal');

    ExtensionUtils.loadStyleSheet(module, 'styles/owl.css');
    ExtensionUtils.loadStyleSheet(module, 'styles/owltheme.css');
    ExtensionUtils.loadStyleSheet(module, 'styles/owltransitions.css');
    ExtensionUtils.loadStyleSheet(module, 'styles/main.css');

    iconService.init();
    iconService.click(modalService.showHandler);

    require('./services/trackingClient').init();
});
