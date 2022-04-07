/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  FormInstance,
  Col,
} from 'antd';
import { resourceFilterConditions } from '../../const';
import { getResourceListAll } from '@/services/resource';
import { resourceItem } from '@/store/businessInterface/resource';
import { useTranslation } from 'react-i18next';
type resource = {
  id: string;
  path: string;
};
type resourceFilterCondition = {
  value: string;
  multiple: boolean;
};
interface Props {
  classpathes: any[];
  field: any;
  initObj?: any;
  onFuncChange: Function;
  form: FormInstance;
}
const researceList = ['InResourceList', 'NotInResourceList'];

const ResourceFilterCondition = (props: Props) => {
  const { t } = useTranslation();
  const { Option } = Select;
  const { classpathes, field, initObj, onFuncChange, form } = props;
  const [resources, setResources] = useState<resourceItem[]>();
  useEffect(() => {
    getResourceListAll().then((res) => {
      setResources(res?.dat.list);
    });
  }, []);
  const resourceFilterConditionOptions = resourceFilterConditions.map(
    (c: resourceFilterCondition) => (
      <Option key={c.value} value={c.value}>
        {c.value}
      </Option>
    ),
  );
  const classpathOptions = classpathes.map((r: resource) => (
    <Option key={r.id} value={r.path}>
      {r.path}
    </Option>
  ));
  const resourcesOptions = resources
    ? resources.map((r: resourceItem) => (
        <Option key={r.id} value={r.ident}>
          {r.ident + ' ' + r.alias}
        </Option>
      ))
    : [];
  const [func, setFunc] = useState(resourceFilterConditions[0].value);
  useEffect(() => {
    setFunc(initObj?.func);
  }, [initObj?.func]);
  const multipleFuncs = resourceFilterConditions
    .filter((r) => r.multiple)
    .map((r) => r.value);

  const changeFunc = (v) => {
    onFuncChange(field.name);
    setFunc(v);
  };

  return (
    <>
      <Col span={8}>
        <Form.Item name={[field.name, 'func']} initialValue='InClasspathPrefix'>
          <Select value={func} onChange={changeFunc}>
            {resourceFilterConditionOptions}
          </Select>
        </Form.Item>
      </Col>
      <Col span={14}>
        {multipleFuncs.includes(
          form.getFieldValue(['res_filters', field.name, 'func']),
        ) ? (
          <Form.Item
            name={[field.name, 'params']}
            initialValue={initObj?.params}
          >
            <Select mode='multiple' value={initObj?.params as Array<string>}>
              {researceList.includes(
                form.getFieldValue(['res_filters', field.name, 'func']),
              )
                ? resourcesOptions
                : classpathOptions}
            </Select>
          </Form.Item>
        ) : (
          <Form.Item
            name={[field.name, 'params', 0]}
            initialValue={initObj?.params}
          >
            <Input value={initObj?.params} />
          </Form.Item>
        )}
      </Col>
    </>
  );
};

export default ResourceFilterCondition;
