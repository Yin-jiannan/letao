$(function () {

  var page = 1;
  var pageSize = 8;

  render();

  function render() {
    $.ajax({

      type: 'get',
      url: '/user/queryUser',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        $("tbody").html(template("tpl", info));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage: page,
          totalPages: Math.ceil(info.total/info.size),
          size:'small',
          onPageClicked:function (a,b,c,p) {
            page = p;
            render();
          }
        });
      }
    });
  };

  //启用与禁用的功能
  $("tbody").on("click", ".btn", function () {

    $("#userModal").modal("show");

    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-success") ? 1 : 0;
    // console.log(id,isDelete);
    
    $(".btn_update").off().on("click", function () { 

      $.ajax({
        type:'post',
        url:'/user/updateUser',
        data:{
          id:id,
          isDelete:isDelete
        },
        success: function (info) { 
          // console.log(info);
          if(info.success === true) {
            $("#userModal").modal("hide");
            render();
          }
         }
      })
     });

  });




});