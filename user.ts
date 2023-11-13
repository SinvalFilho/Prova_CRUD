import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.get("/user", async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    return res.json(clients);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });
    if (!client) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.json(client);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

app.post("/user", async (req, res) => {
  const { nome, email } = req.body;

  try {
    const existingUser = await prisma.client.findUnique({
      where: {
        nome,
        email,
      },
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "Email já existente" });
    }

    const newUser = await prisma.client.create({
      data: {
        nome,
        email,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

app.put("/user/:id", async (req, res) => {
  const { nome, email } = req.body;

  try {
    const updatedUser = await prisma.client.update({
      data: {
        nome,
        email,
      },
      where: {
        id: Number(req.params.id),
      },
    });

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    await prisma.client.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
