Vue.use(VueShortkey);

new Vue({
    el: '#app',
    data: {
        cont: '<h1>test</h1>',
        json: [],
        titlesj: [],
        viewer: 0,
        pagesList: [],
        chaptersjs: "https://gist.githubusercontent.com/etsune/2ba51e1c45cf860364d2c3f9d6b6560e/raw/3332cfea6731eec17174ba3a11f81f6521492f5c/chapters.json",
        titlesjs: "https://gist.githubusercontent.com/etsune/2ba51e1c45cf860364d2c3f9d6b6560e/raw/3332cfea6731eec17174ba3a11f81f6521492f5c/titles.json",
        chaplist: [],
        activetitle: {},
        achapter: {},
        searching: '',
        loader: false,
    },
    methods: {
        returnf: function () {
            this.viewer = 2;
        },
        // repairalias: function (aliased) {
        //     if (aliased.alias == null) return true;
        //     var js_i = this.json;
        //     this.json.forEach(function (ch, i) {
        //         if (ch.title == aliased.alias) {
        //             js_i[i].aliases = js_i.aliases.concat(aliased.alias);
        //             console.log(js_i[i].aliases)
        //         }
        //     });
        //     this.json = js_i;
        //     return false;
        // },
        openReader: function (title) {
            this.activetitle = title;
            var chaplistv = [];
            var idents = [title.ident];
            this.titlesj.forEach(function (ch, i) {
                if (ch.alias != null && ch.alias == title.ident) {
                    idents = idents.concat(ch.ident);
                }
            });
            this.json.forEach(function (ch, i) {
                if (idents.includes(ch.ident)) {
                    chaplistv = chaplistv.concat(ch);
                }
            });
            this.chaplist = chaplistv;
            this.viewer = 2;
        },
        openchapter: function (chapter) {
            // this.pagesList = chapter.imgs;
            this.achapter = chapter;
            this.viewer = 1;
        },
        loading: function () {
            this.loader = true;
            this.$http.get(this.chaptersjs).then(function (response) {
                this.$http.get(this.titlesjs).then(function (response2) {
                    this.json = response.data;
                    this.titlesj = response2.data;
                    this.loader = false;
                }, function (error2) {
                });
            }, function (error) {
            });
        },
        search: function (sch) {
            this.searching = sch;
        }
    },
    created: function () {
        this.loading();
    },
    components: {
        reader: {
            template: '#ad-reader',
            data: function () {
                return {
                    imagedisp: '',
                    preload: [],
                    active: 0,
                }
            },
            props: ['achapter', 'atitle'],
            methods: {
                changePage: function (page, t) {
                    if (page == t.length || page == -1) return;
                    this.active = page;
                    this.earlydl();
                },
                prev_dis: function (t) {
                    return { 'disabled': t < 1 }
                },
                next_dis: function (t) {
                    return { 'disabled': this.active == t.length - 1 }
                },
                earlydl: function () {
                    var ploa = [];
                    for (let i = 1; i < 3; i++) {
                        if (this.adPages[this.active + i] != null) ploa = ploa.concat(this.adPages[this.active + i]);
                    }
                    this.preload = ploa;
                    return true;
                }
            },
            computed: {
                adPages: function () {
                    return this.achapter.imgs;
                }
            },
            created: function () {
                this.earlydl();
            }
        },
        loader: {
            template: '#loader',
        },
        adheader: {
            template: '#ad-nav',
            data: function () {
                return {
                    searching: '',
                }
            },
            props: {
                nviewer: 0,
            },
        },
        adprj: {
            template: '#adprj',
            data: function () {
                return {

                }
            },
            props: ['prj', 'nviewer', 'titles', 'searching', 'chapters'],
            methods: {
                mangalist: function (title) {
                    if (title.alias != null) return false;
                    var searchline = this.searching.toLowerCase();
                    return (title.orig.toLowerCase().includes(searchline) || title.ru.toLowerCase().includes(searchline));
                },
                computeDate: function (title) {
                    var date;
                    this.chapters.some(function (ch) {
                        if (ch.ident == title) {
                            date = new Date(ch.updated);
                            return true;
                        }
                    });
                    if (date == null) return "???";
                    var options = { year: 'numeric', month: 'long', day: 'numeric' };
                    return date.toLocaleDateString("ru-RU", options);
                },
            }
        },
        adfooter: {
            template: '#adfooter'
        },
        adpage: {
            template: '#adpage',
            props: ['chapters', 'titleinfo'],
            methods: {
                getdate: function (date) {
                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                    var day = new Date(date);
                    return day.toLocaleDateString("ru-RU", options);
                }
            }
        },
    },
});