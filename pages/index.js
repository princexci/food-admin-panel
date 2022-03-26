import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Popconfirm,
  Table,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { useState } from "react";
import useSWR from "swr";
import Loading from "../components/Loading";
import { $axios } from "../lib/axios";

export default function Index() {
  const { data, isValidating, mutate } = useSWR("/recipe", $axios, {
    revalidateOnFocus: false,
  });
  const [mode, setMode] = useState("ADD");
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // For EDIT
  const [editId, setEditId] = useState(null);

  const openModal = (data) => {
    setTimeout(() => {
      if (data) {
        recipeForm.setFieldsValue({
          ...data,
        });
        setEditId(data.id);
      }
    }, [10]);
    setModalVisible(true);
    setMode(data ? "EDIT" : "ADD");
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      console.log(formData);
      if (mode === "ADD") {
        await $axios.post("/recipe", formData);
      } else {
        await $axios.put(`/recipe/${editId}`, formData);
      }
      await mutate();
      notification.success({
        message: "Recipe added.",
      });
      closeModal();
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deleteId) => {
    try {
      setLoading(true);
      await $axios.delete(`/recipe/${deleteId}`);
      await mutate();
      notification.success({
        message: "Recipe deleted.",
      });
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Food",
      dataIndex: "name",
      render: (_, result) => (
        <div>
          <Image
            placeholder
            src={result.picture}
            height={100}
            width={200}
            className="object-cover"
            preview={false}
          />
          <div className="font-bold mt-2">{result.name}</div>
        </div>
      ),
    },
    {
      title: "Ingredients",
      dataIndex: "ingredients",
      render: (ingredients) => (
        <Paragraph
          ellipsis={{
            rows: 4,
            expandable: true,
          }}
        >
          {ingredients.map((ingredient, index) => (
            <li key={index}>- {ingredient}</li>
          ))}
        </Paragraph>
      ),
    },
    {
      title: "Action",
      render: (_, data) => (
        <div className="flex">
          <Button
            className="flex items-center"
            type="link"
            onClick={() => openModal(data)}
          >
            <EditOutlined /> Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(data.id)}
          >
            <Button type="link" className="flex items-center text-red-500">
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (!data && isValidating) {
    return <Loading />;
  }

  return (
    <div>
      <Card>
        <Title className="font-black">Recipes</Title>
        <div className="flex justify-end mb-5">
          <Button
            size="large"
            type="primary"
            className="mb-3 flex items-center"
            onClick={() => openModal(null)}
          >
            <PlusOutlined />
            Add Recipes
          </Button>
        </div>
        <Table
          loading={isValidating}
          columns={columns}
          dataSource={data}
          rowKey={(d) => d.id}
        />

        {/* Add / Edit Form */}
        <Modal
          visible={modalVisible}
          onCancel={closeModal}
          title={mode === "ADD" ? "New Recipe" : "Update Recipe"}
          footer={null}
          afterClose={() => {
            recipeForm.resetFields();
          }}
        >
          <Form
            form={recipeForm}
            initialValues={{
              name: "",
              picture: "",
              ingredients: ["", ""],
            }}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="Name of recipe" />
            </Form.Item>
            <Form.Item
              label="Picture"
              name="picture"
              rules={[
                {
                  type: "url",
                  required: true,
                },
              ]}
            >
              <Input placeholder="Picture url" />
            </Form.Item>
            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <div
                      className="flex gap-5 justify-between items-start"
                      key={key}
                    >
                      <Form.Item
                        className="w-full"
                        label={name === 0 ? "Ingredients" : ""}
                        name={name}
                        rules={[
                          {
                            required: true,
                            message: "Missing ingredient description",
                          },
                        ]}
                      >
                        <Input placeholder={`Ingredient ${name + 1}`} />
                      </Form.Item>
                      {name !== 0 && (
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      )}
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      className="flex items-center justify-center"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Ingredient
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Button loading={loading} block type="primary" htmlType="submit">
              {mode === "ADD" ? "Create Recipe" : "Save Recipe"}
            </Button>
          </Form>
        </Modal>
      </Card>
    </div>
  );
}
