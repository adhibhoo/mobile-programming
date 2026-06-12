$(document).ready(function () {

    // 1. GET & SET
    $("#btn-show-name").click(function () {
        $("#output").text($("#student-name").text());
    });

    $("#btn-change-name").click(function () {
        $("#student-name").text("Your Name Here");
    });

    $("#btn-show-bio").click(function () {
        $("#output").text($("#student-bio").html());
    });

    $("#btn-get-input").click(function () {
        $("#output").text($("#nickname-input").val());
    });

    $("#btn-set-input").click(function () {
        $("#nickname-input").val("jQuery Pro");
    });

    // 2. CSS CLASSES
    $("#btn-highlight").click(function () {
        $("#profile-card").addClass("highlighted");
    });

    $("#btn-remove-highlight").click(function () {
        $("#profile-card").removeClass("highlighted");
    });

    $("#btn-dark-mode").click(function () {
        $("#profile-card").toggleClass("dark-mode");
    });

    $("#btn-rounded").click(function () {
        $("#profile-photo").toggleClass("rounded");
    });

    // 3. CSS METHOD
    $("#btn-red-bg").click(function () {
        $("#profile-card").css("background", "#e74c3c");
    });

    $("#btn-reset-bg").click(function () {
        $("#profile-card").css("background", "white");
    });

    // 4. HIDE & SHOW
    $("#btn-hide-photo").click(function () {
        $("#profile-photo").hide("slow");
    });

    $("#btn-show-photo").click(function () {
        $("#profile-photo").show("slow");
    });

    $("#btn-toggle-bio").click(function () {
        $("#student-bio").toggle();
    });

    // 5. FADE
    $("#btn-fade-out").click(function () {
        $("#profile-card").fadeOut();
    });

    $("#btn-fade-in").click(function () {
        $("#profile-card").fadeIn();
    });

    $("#btn-fade-half").click(function () {
        $("#profile-card").fadeTo("slow", 0.5);
    });

    // 6. SLIDE
    $("#btn-slide-up").click(function () {
        $("#skills-list").slideUp();
    });

    $("#btn-slide-down").click(function () {
        $("#skills-list").slideDown();
    });

    $("#btn-slide-toggle").click(function () {
        $("#skills-list").slideToggle();
    });

    // 7. ANIMATE
    $("#btn-animate").click(function () {
        $("#profile-card")
            .animate({ marginLeft: "200px" }, 1000)
            .animate({ marginLeft: "0px" }, 1000);
    });

    // 8. EVENTS
    $("#profile-photo").on("mouseenter", function () {
        $(this).addClass("shadow");
    }).on("mouseleave", function () {
        $(this).removeClass("shadow");
    });

    $("#nickname-input").on("keypress", function (e) {
        $("#output").text("Key pressed: " + e.key);
    });

});