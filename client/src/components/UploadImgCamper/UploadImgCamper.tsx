import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import axios from 'axios';


const UploadImgCamper = ({setImage}) => {
  const [action, setAction] = useState([])
  const fileList = [];

  const handleRemovePhoto = async (name) => {
    try {
      const filerImg = action.filter((el)=>el.uid === name)
      await axios.post(`http://localhost:3000/camper/parthner/del/img`, filerImg, {withCredentials: true});
    } catch (err) {
      console.error('Ошибка при удалении фотографии', err);
    }
  };


return(
  <>
		<Upload 
      action={'http://localhost:3000/camper/parthner/img'}
      defaultFileList={[...fileList]}
      maxCount={1}
      listType="picture"
      withCredentials="true"
			// fileList={fileList}
      name={'img'}
      onRemove={(e)=>handleRemovePhoto(e.uid)}
      onDownload={()=>setImage(true)}
      onChange={(file)=>{
        if (file.file.response) {
          fileList.push(file.fileList[0])
          setAction((prev)=>[...prev, {uid: file.file.uid, name: file.file.response}])
          setImage((prev)=>!prev)
        }
        
      }}
    >
    <Button icon={<UploadOutlined />}>Загрузить</Button>
    </Upload>

  </>
)
};
export default UploadImgCamper;