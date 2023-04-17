// run on document load
$(document).ready(() => {
    // fade in the body
    $(document.body).fadeIn(2000);

    // slide down the div
    $("#howItWorks").slideUp(0);
    $("#howItWorks").slideDown(5000);

    // set scale to 100 on load
    $("#mainGraphic").stop().animate({
        scale: "100%",
    });

    // set both css properties of opacity to 1/2
    $("#placeStart").css("opacity", 0.5);
    $("#placeEnd").css("opacity", 0.5);

    // ==============================================
    // events for hovering when entering and leaving hover

    $("#placeStart").mouseenter(() => {
        $("#placeStart").css("opacity", 1);
    });

    $("#placeStart").mouseleave(() => {
        $("#placeStart").css("opacity", 0.5);
    });

    // ==============================================
    // events for hovering when entering and leaving hover

    $("#placeEnd").mouseenter(() => {
        $("#placeEnd").css("opacity", 1);
    });

    $("#placeEnd").mouseleave(() => {
        $("#placeEnd").css("opacity", 0.5);
    });

    // ==============================================
    // when hover image, animate to bigger

    $("#mainGraphic").hover(
        () => {
            $("#mainGraphic").stop().animate({
                scale: "120%",
            });
        },
        () => {
            $("#mainGraphic").stop().animate({
                scale: "100%",
            });
        }
    );
});
