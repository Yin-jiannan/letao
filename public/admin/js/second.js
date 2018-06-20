$(function () {

  var page = 1;
  var pageSize = 5;

  render();

  function render() {

    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        //  console.log(info);
        $("tbody").html(template("tpl", info));

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: page,
          totalPages: Math.ceil(info.total / info.size),
          size: 'small',
          onPageClicked: function (a, b, c, p) {
            page = p;
            render();
          }
        });
      }

    });

  }

  // 添加二级分类
  $(".btn_add").on("click", function () {
    $('#addModal').modal("show");

    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $(".dropdown-menu").html(template("tpl2", info));
      }
    });
  });

  //一级分类选择
  $(".dropdown-menu").on("click", "a", function () {

    var txt = $(this).text();
    $(".dropdown-text").text(txt);

    var id = $(this).data("id");
    $("[name='categoryId']").val(id);

    $("form").data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });

  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data.result.picAddr);

      $(".img_box img").attr("src", data.result.picAddr);

      $("[name='brandLogo']").val(data.result.picAddr);

      $("form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

  //表单校验功能
  $("form").bootstrapValidator({
    //excluded:指定不校验的类型，[]所有的类型都校验
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类的名称'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传二级分类的图片'
          }
        }
      }
    }
  });


  //表单校验成功，阻止表单提交，使用ajax提交
  $("form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑

    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $("form").serialize(),
      success: function (info) {

        // console.log(info);
        
        if (info.success) {
          $("#addModal").modal("hide");

          page = 1;
          render();
          $("form").data("bootstrapValidator").resetForm(true);
          $(".dropdown-text").text("请选择一级分类");
          $(".img_box img").attr("src","images/none.png");
        
        }
      },
     
    })
  });


});