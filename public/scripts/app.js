$(document).ready(function() {
  const $comments = $('.comments');
  const $commentText = $('#commentText');

  $comments.on("click", function() {
    if ($commentText.is(":visible")) {
      $commentText.hide("slow");
    } else {
      $commentText.show("slow");
    }
  });
});