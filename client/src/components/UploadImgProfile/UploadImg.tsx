

import React, { useContext, useEffect, useState } from 'react';
import { CameraOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import axios from 'axios';
import './UploadImg.module.css'
import { UserContext } from '../../context/userContext';


type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImg: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [img, setImg] = useState<FileType | null>(null);
  const { user_Id, userPhoto, setUserPhoto } = useContext(UserContext);

  useEffect(() => {
    if (!userPhoto) {
     setFileList([])
      return
    }

     setFileList([{ 
      uid: '-1',
      name: userPhoto,
      status: 'done',
      url: `http://localhost:3000/images/${userPhoto}`,
    }])
  }, [userPhoto])


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
     
  };
const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setImg(newFileList[0].originFileObj as FileType);
      try {
        const data = new FormData();
        data.append('avatar', newFileList[0].originFileObj as File);
         await axios.post(`http://localhost:3000/profile/avatar/${user_Id}`, data, {
          headers: {
            'content-type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        // setUserPhoto(response.data.img);
      } catch (err) {
        console.error('Ошибка при загрузке изображения', err);
        message.error('Ошибка при загрузке изображения');
      }
    } else {
      setImg(null);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <CameraOutlined />
      <div style={{ marginTop: 8 }}>Загрузить фото</div>
    </button>
  );

  const handleRemovePhoto = async () => {
    try {
      await axios.delete(`http://localhost:3000/profile/avatar/${user_Id}`, {withCredentials: true});
      // setUserPhoto(null);
      setFileList([]);
      message.success('Фотография успешно удалена');
    } catch (err) {
      console.error('Ошибка при удалении фотографии', err);
      message.error('Ошибка при удалении фотографии');
    }
  };

  return (
    <>
      <Upload 
        action={`http://localhost:3000/profile/avatar/${user_Id}`}
        className="uploadUserAvatar"
        onRemove={handleRemovePhoto}
        listType="picture-circle"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        name={'avatar'}
      >
        {fileList.length === 0 ? uploadButton : null}
      </Upload>
      {previewImage && (
        <Image
          className="userAvatar"
          
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImg;
