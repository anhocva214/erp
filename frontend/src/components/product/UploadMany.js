import { Card, Typography } from "antd";
import UploadMany from "../Card/UploadMany";
import styles from "./AddProd.module.css";

const ImportFromCSV = ({ urlPath, title }) => {
  return (
    <>
      <center>
        <Card className={`${styles.importCsvCard} column-design `}>
          <div
            className='p-8 bg-white dark:bg-transparent shadow rounded-lg dashboard-card-bg '
            style={{ maxWidth: "720px" }}
          >
            <Typography.Title level={3} className='m-2 text-center'>
              Import {title} From CSV
            </Typography.Title>
            <UploadMany urlPath={urlPath} />
          </div>
        </Card>
      </center>
    </>
  );
};

export default ImportFromCSV;
