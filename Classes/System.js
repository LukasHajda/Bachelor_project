class System {
    constructor() {
        this.backgroundColor_first = $('#backgroundColor-first');
        this.backgroundColor_second = $('#backgroundColor-second');
        this.set_events();
    }


    set_events() {
        let self = this;
        $('.colorPick').change(function () {
            $("body").css({
                background : 'linear-gradient(' + $(self.backgroundColor_first).val() + ',' + $(self.backgroundColor_second).val() + ') no-repeat fixed'
            }, 200)
        });
    }
}