<template>
  <div class="detailed-info-container">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="商品售价" prop="price">
        <a-input v-model="form.price" placeholder="请填写商品售价" />
      </a-form-model-item>
      <a-form-model-item label="折扣价格" prop="price_off">
        <a-input
          v-model="form.price_off"
          placeholder="请填写商品折扣价格（若有）"
        />
      </a-form-model-item>
      <a-form-model-item label="商品库存" prop="inventory">
        <a-input v-model="form.inventory" placeholder="请填写商品库存" />
      </a-form-model-item>
      <a-form-model-item label="计量单位" prop="unit">
        <a-input v-model="form.unit" placeholder="请填写计量单位" />
      </a-form-model-item>
      <a-form-model-item label="商品相册" prop="images">
        <div class="clearfix">
          <a-upload
            :action="`http://mallapi.duyiedu.com/upload/images?appkey=${$store.state.userInfo.appkey}`"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            name="avatar"
          >
            <div v-if="fileList.length < 8">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal
            :visible="previewVisible"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 22 }" class="btn">
        <a-button type="primary" style="margin-right: 30px" @click="prev"
          >上一步</a-button
        >
        <a-button type="primary" @click="next">提交</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default {
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      rules: {
        price: [
          { required: true, message: "商品售价必须填写", trigger: "blur" },
        ],
        inventory: [
          { required: true, message: "商品库存必须填写", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "计量单位必须填写", trigger: "blur" },
        ],
      },
      previewVisible: false,
      previewImage: "",
      fileList: [],
    };
  },
  methods: {
    prev() {
      this.$emit("prev");
    },
    next() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.$emit("next", this.form);
          localStorage.removeItem("fileList");
          return true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      console.log("cancel");
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ file, fileList }) {
      if (file.status === "done") {
        this.form.images.push(file.response.data.url);
      }
      if (file.status === "removed") {
        const removeIndex = this.form.images.indexOf(file.response.data.url);
        this.form.images.splice(removeIndex, 1);
      }

      this.fileList = fileList;
      console.log(fileList);
      localStorage.setItem("fileList", JSON.stringify(fileList));
    },
  },
  created() {
    if (localStorage.getItem("fileList")) {
      this.fileList = JSON.parse(localStorage.getItem("fileList"));
    }

    if (this.form.images.length) {
      this.fileList.push(
        ...this.form.images.map((item, index) => ({
          uid: index,
          name: `image-${index}.png`,
          status: "done",
          url: item,
        }))
      );
    }
  },
};
</script>

<style scoped>
.btn {
  text-align: center;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
