$(document).ready(function() {
    const template = $('#app').html();
    const templateScript = Handlebars.compile(template);

    //API Endpoint
    const USERLIST_API = "https://jsonplaceholder.typicode.com/users";

    //API 				
    fetch(USERLIST_API)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            const context = {
                "users": json
            };
            const html = templateScript(context);
            $(document.body).append(html);

            //Additional Info Button Click Handler
            $("button").click(function() {
                $(this).closest("ul").find(".additional-info").show();
                $(this).hide();
            });

        }).catch((err) => {
            console.log(err, "UserList API Error");
        });

});