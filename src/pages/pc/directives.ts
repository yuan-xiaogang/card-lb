import Vue from 'vue'
const plugins:any = {}
plugins.install = function (Vue:any) {
    Vue.directive('tbHeight', {
        inserted (el: any) {
            const setHeight = () => {
                el.style.height = document.body.offsetHeight - el.nextSibling.offsetHeight - el.offsetTop - 20 + 'px';
            }
            setHeight();
            window.onresize = setHeight;
            
        }
    })
}
Vue.use(plugins)