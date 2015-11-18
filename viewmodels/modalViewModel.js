define(function (require, exports, module) {
    var ko = require('../vendor/knockout'),
        _ = require('../vendor/lodash'),
        owl = require('../vendor/owl'),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        NodeConnection = brackets.getModule("utils/NodeConnection"), //required
        DocumentManager = brackets.getModule("document/DocumentManager"), //required
        EditorManager = brackets.getModule("editor/EditorManager"), //required
        nodeConnection = new NodeConnection(); //required

    function ModalViewModel() {
        this.width = ko.observable(200);
        this.height = ko.observable(150);
        this.theme = ko.observable('travel');
        this.image = ko.observable('');
        this.choosenType = ko.observable('html');

        var maxImages = 50;
        var previewBox = $('.preview-box');
        var gallery = $('.gallery');

        var currentTheme = this.theme();
        var currentImage = 0;
        var owlStatus = false;

        var currentDoc = DocumentManager.getCurrentDocument(),
            editor = EditorManager.getCurrentFullEditor(),
            pos = editor.getCursorPos(),
            posIni = editor.getCursorPos(),
            posEnd;

        this.url = ko.computed(function () {
            var locurl = 'http://gimepix.com/img/' +
                this.width() + '-' +
                this.height() + '-' +
                (this.theme() != 0 ? this.theme() : '') + '-' +
                pad(currentImage + 1, 3);
            return locurl;
        }, this);

        this.onLinkClick = _.bind(function (model, event) {
            currentImage = owl.data('owlCarousel').currentImage();
            var locurl = 'http://gimepix.com/img/' +
                this.width() + '-' +
                this.height() + '-' +
                (this.theme() != 0 ? this.theme() : '') + '-' +
                pad(currentImage + 1, 3);

            $('.url').val(locurl);

        }, this);

        this.onClose = _.bind(function (model, event) {
            editor.focus();
            editor.setSelection(posIni, posEnd);
        }, this);

        this.onPreview = _.bind(function (model, event) {

            if (this.theme() != currentTheme) {
                currentTheme = this.theme();
                var imagens = makeCellHtml(currentTheme);
                gallery.html(imagens);
                owl.owlCarousel();
                owl.data('owlCarousel').reinit();
            }
            event.stopPropagation();
        }, this);

        this.select = function (model, event) {
            $(event.target).select();
            return true;
        }

        this.onUrlInsert = _.bind(function (model, event) {
            var locurl = $('.url').val();
            var content = '<img class="sel" src="' + locurl + '" width="100" height="66">';
             $('#sele').append(content);
            if (this.choosenType() == 'html') {
                locurl = '<img class="img img-responsive" src="' + locurl + '"/>\n';
            }
            if (this.choosenType() == 'background') {
                locurl = 'background: url(' + locurl + ') no-repeat;\n';
            }
            currentDoc.replaceRange(locurl, pos);
            posEnd = $.extend({}, pos);
            posEnd.ch += locurl.length;
            pos = editor.getCursorPos();


            // owl.data('owlCarousel').removeItem();
        }, this);

        var owl = $("#owl").owlCarousel({
            autoPlay: 5000,
            items: 1,
            autoPlay : false,
            stopOnHover: true,
            pagination: false,
            paginationNumbers: false,
            navigationText : ["previous","next"],
            itemsDesktop: [1199, 3],
            itemsDesktopSmall: [979, 3],
            navigation: true,
            singleItem : true,
            transitionStyle : "backSlide"

        });

        owl.owlCarousel();

        var imagem = "",
            locurl = "http://www.gimepix.com/img/180-102-" + this.theme() + "-";

        for (i = 1; i <= maxImages; i++) {
            imagem = '<div class="item">' +
                '<img width="180" height="102" id="i' + pad(i, 3) +
                '" class="imagem img igm-responsive" src="' + locurl + pad(i, 3) +
                '"><span class="itemnum">'+pad(i, 3)+'</span></div>';

            owl.data('owlCarousel').addItem(imagem);

        }
        previewBox.children("img").attr("src", this.url());

        function createGallery(category) {
            var imagens = makeCellHtml(category);
            if (owl != null) {
                owl.destroy();
            }
            owlStatus = true;
            gallery.html(imagens);
        }

        function pad(str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
        }

        function makeCellHtml(cat) {
            var htmlBlock = "",
                locurl = "http://www.gimepix.com/img/180-102-" + cat + "-";
            for (i = 1; i <= maxImages; i++) {
                htmlBlock += '<div class="item link" data-bind-"value: item, click: onLinkClick>' +
                    '<img id="i' + pad(i, 3) +
                    '" class="imagem img igm-responsive" src="' + locurl + pad(i, 3) +
                    '"><span class="itemnum">'+pad(i, 3)+'</span></div>';
            }
            return htmlBlock;
        }
    }



    module.exports = ModalViewModel;
});
