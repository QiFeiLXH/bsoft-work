<template>
  <div :style="{height: formHeight+'px',overflowY:'scroll'}" v-watermark>
    <a-form-model :model="businessCardForm" ref="businessCardForm">
      <a-card :body-style="{ padding: '10px 0 10px 10px' }" style="background: rgba(0,0,0,0)">
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="申 请 人"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="userName">
              <a-input :readOnly="true" v-model="businessCardForm.userName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="申请时间"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="applyDate">
              <a-input :readOnly="true" v-model="businessCardForm.applyDate" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="申请部门"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="deptName">
              <a-input :readOnly="true" v-model="businessCardForm.deptName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="归属项目"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="projectName">
              <template  v-if="businessCardForm.projectName">
                <a-tooltip>
                  <template slot="title">
                    {{ businessCardForm.projectName }}
                  </template>
                  <a-input :readOnly="true" v-model="businessCardForm.projectName" style="width: 257px;color: #000000"/>
                </a-tooltip>
              </template>
              <template v-else>
                <a-input :readOnly="true" v-model="businessCardForm.projectName" style="width: 257px;color: #000000"/>
              </template>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="费用类别"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="costTypeText">
              <a-input :readOnly="true" v-model="businessCardForm.costTypeText" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="核算口径归属"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="accountCaliberText">
              <a-input
                :readOnly="true"
                v-model="businessCardForm.accountCaliberText"
                style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="岗位名称"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="postName">
              <a-input :readOnly="true" v-model="businessCardForm.postName" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="邮 箱"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="email">
              <a-input :readOnly="true" v-model="businessCardForm.email" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="传真"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="fax">
              <a-input :readOnly="true" v-model="businessCardForm.fax" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="电话"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="telephone">
              <a-input :readOnly="true" v-model="businessCardForm.telephone" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="手机"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="mobilePhone">
              <a-input :readOnly="true" v-model="businessCardForm.mobilePhone" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="地址"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="address">
              <template  v-if="businessCardForm.address">
                <a-tooltip>
                  <template slot="title">
                    {{ businessCardForm.address }}
                  </template>
                  <a-input :readOnly="true" v-model="businessCardForm.address" style="width: 257px;color: #000000"/>
                </a-tooltip>
              </template>
              <template v-else>
                <a-input :readOnly="true" v-model="businessCardForm.address" style="width: 257px;color: #000000"/>
              </template>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="13">
            <a-form-model-item
              label="流 水 号"
              :labelCol="{lg: {span: 6}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 18}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="lshid">
              <a-input :readOnly="true" v-model="businessCardForm.lshid" style="width: 300px;color: #000000"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="11">
            <a-form-model-item
              label="金额"
              :labelCol="{lg: {span: 7}, sm: {span: 2}}"
              :wrapperCol="{lg: {span: 17}, sm: {span: 20} }"
              style="margin-bottom: 10px;"
              prop="amount">
              <a-input :readOnly="true" :value="businessCardForm.amount | AmountFormat" style="width: 257px;color: #000000"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-card style="background: rgba(255,255,255,0)">

      <a-card :body-style="{ padding: '10px 250px' }" :bordered="false" style="background: rgba(0,0,0,0)">
        <viewer :images="QRCodePicture" ref="viewer">
          <a-card hoverable style="width: 350px">
            <a-spin :spinning="isSpinning">
              <div style="width: 300px;height: 300px;background-color: #f2f2f2" v-if="isSpinning"></div>
              <img :src="imageSrc" v-else/>
            </a-spin>
            <template slot="actions" class="ant-card-actions">
              <a-icon key="eye" type="eye" @click="enlargeImage"/>
              <a-icon key="loading" type="loading" v-if="downloading"/>
              <a-icon key="download" type="download" @click="downloadImage" v-else/>
            </template>
          </a-card>
        </viewer>
      </a-card>

    </a-form-model>
  </div>
</template>
<script>
import moment from 'moment'
import { downloadBusinessCardImage } from '@/api/businessCard'
import { downFile } from '@/utils/util'

export default {
  name: 'BusinessCardInfoModule',
  data () {
    return {
      moment,
      businessCardForm: {},
      imageSrc: '',
      QRCodePicture: [],
      downloading: false,
      isSpinning: true
    }
  },
  props: {
    businessCardInfo: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    viewHeight: function () {
      return window.innerHeight - 100
    },
    formHeight: function () {
      return window.innerHeight - 110
    }
  },
  methods: {
    initFormFields () {
      this.imageSrc = ''
      this.businessCardForm = {
        id: null,
        userName: null,
        applyDate: null,
        deptName: null,
        projectName: null,
        costTypeText: null,
        accountCaliberText: null,
        postName: null,
        email: 0,
        fax: null,
        telephone: null,
        mobilePhone: null,
        address: null,
        lshid: null,
        amount: null,
        imageId: null
      }
    },
    enlargeImage () {
      // 直接显示图片
      const viewer = this.$refs.viewer.$viewer
      viewer.show()
    },
    downloadImage () {
      if (this.downloading) {
        return
      }
      this.downloading = true
      var imageName = this.businessCardForm.userId + '_' + this.businessCardForm.userName
      downloadBusinessCardImage({ id: this.businessCardForm.id }).then(res => {
        const headers = res.headers
        const contentType = headers['content-type']
        if (res.data) {
          const blob = new Blob([res.data], { type: contentType })
          const contentDisposition = res.headers['content-disposition']
          let fileName = 'unknown'
          if (contentDisposition) {
            fileName = imageName + '.jpg'
          }
          downFile(blob, fileName)
          this.downloading = false
        }
        this.downloading = false
      })
    },
    showBusinessCardImage () {
      var bgImg = new Image()
      var urlSrc = '/api/businesscard/showimage?id=' + this.businessCardForm.id + '&time=' + moment().millisecond()
      bgImg.src = urlSrc // 获取背景图片的url
      bgImg.onerror = () => {
        console.log('img onerror')
      }
      bgImg.onload = () => { // 等背景图片加载成功后 去除loading
        this.isSpinning = false
        this.imageSrc = urlSrc
        this.QRCodePicture = []
        this.QRCodePicture.push(this.imageSrc)
      }
    },
    initFormData () {
      this.businessCardForm = { ...this.businessCardInfo }
      this.showBusinessCardImage()
    },
    initPage () {
      this.initFormFields()
      this.initFormData()
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style scoped>

</style>
