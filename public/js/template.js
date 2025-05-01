const headerTemplate = Vue.createApp({
    data: function () {
        return {
            url_list: [
                {
                    name: "Home",
                    url: "/"
                },
                // {
                //     name: "Setting",
                //     url: "/setting"
                // },
                // {
                //     name: "Log-Out",
                //     url: "/api/log-out"
                // }
            ]
        }
    },
    // <img src="/img/guestbook.png" alt="" width: "20">

    template: 
    `
        
        <div class="logo" >
            <a href="#"> 
                Stock Martket Emperor
            </a>
        </div>
        <nav class="nav-menu">
            <div v-for="(item, index) in url_list">
                <a :href="item.url"> {{item.name}} </a>
            </div>
        </nav>
        
        <button class="nav-menu-but">
            <div class="nav-menu-icon">
        </button>
    `
})

const footerTemplate = Vue.createApp({
    data: function () {
        return {

        }
    },
    template: 
    `
        <div>
            <span>&copy; Copyright ${new Date().getFullYear()} By Ender</span>
        </div>
    `
})

headerTemplate.mount('#header')
footerTemplate.mount('#footer')