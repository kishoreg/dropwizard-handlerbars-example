/**
 * Created by saan on 10/11/13.
 */
var STUDENT_METHOD = {

    handlerData: function(resJSON) {

        var templateSource = $("#student-template").html()

        var template = Handlebars.compile(templateSource)
        console.log('json' + resJSON)
var obj = eval("(" + resJSON + ')');
        var html = template(obj)

        $('#student-container').html(html);
        console.log($("#student-template"))
        console.log(templateSource)
        console.log(html)
    },
    loadStudentData: function() {

        $.ajax({
            url: "data/studentData.json",
            method: 'get',
            success: this.handlerData

        })
    }
};
var TWITTER_METHOD = {

    handlerData: function(resJSON) {
        var templateSource = $("#twitter-template").html()
        var template = Handlebars.compile(templateSource)
        Handlebars.registerHelper('fullName', function(person) {
            return person.firstName + " " + person.lastName;
        });
        console.log('json' + resJSON)
      var obj = eval("(" + resJSON + ')');
        var html = template(obj)

        $('#twitter-container').html(html);
        console.log($("#student-template"))
        console.log(templateSource)
        console.log(html)
    },
    loadTwitterData: function() {
        $.ajax({
            url: "data/twitterData.json",
            method: 'get',
            success: this.handlerData

        })

    }
};
var SIMPLE_METHOD = {
    handlerData: function(resJSON) {
        var source = $("#entry-template").html();
        var template = Handlebars.compile(source);
        var context = {
            title: "My New Post",
            body: "This is my first post!"
        };
        console.log('context');
        console.log(context)
        console.log('resJSON');
        console.log(resJSON)
        //THIS DOES NOT WORK
        var obj = JSON.parse(resJSON);
        var html = template(obj);
        //THIS WORK
        //var html = template(context);
        
        $('body').append(html);

    },
    loadSimpleData: function() {
        $.ajax({
            url: "data/simpleData.json",
            method: 'get',
            success: this.handlerData
        })

    }
}
$(document).ready(function() {


    SIMPLE_METHOD.loadSimpleData();

    STUDENT_METHOD.loadStudentData();
    TWITTER_METHOD.loadTwitterData();
});