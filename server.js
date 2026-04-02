import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 5000;

  app.use(express.json());

  // Mock API Routes
  app.post("/api/user", (req, res) => {
    const { height, weight } = req.body;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = "Normal";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    res.json({ bmi: bmi.toFixed(1), category });
  });

  app.get("/api/meals", (req, res) => {
    const { diet, bmi, allergies } = req.query;
    const allergyList = allergies ? allergies.split(",") : [];

    // Sample data
    const allMeals = [
      {
        id: 1,
        name: "Avocado Toast with Poached Egg",
        type: "breakfast",
        calories: 350,
        protein: 15,
        carbs: 30,
        fats: 20,
        diet: ["veg", "eggetarian"],
        allergies: ["gluten", "eggs"],
        imageSeed: "photo-1525351484163-7529414344d8",
        ingredients: [
          { name: "Whole grain bread", quantity: "1 slice" },
          { name: "Avocado", quantity: "1/2" },
          { name: "Egg", quantity: "1" },
          { name: "Red pepper flakes", quantity: "pinch" }
        ],
        recipe: [
          "Toast the bread until golden brown.",
          "Mash the avocado and spread it on the toast.",
          "Poach the egg in simmering water for 3 minutes.",
          "Place the egg on top and sprinkle with red pepper flakes."
        ]
      },
      {
        id: 2,
        name: "Quinoa Salad with Chickpeas",
        type: "lunch",
        calories: 450,
        protein: 18,
        carbs: 60,
        fats: 15,
        diet: ["veg", "vegan"],
        allergies: [],
        imageSeed: "photo-1512621776951-a57141f2eefd",
        ingredients: [
          { name: "Quinoa", quantity: "1/2 cup" },
          { name: "Chickpeas", quantity: "1/2 cup" },
          { name: "Cucumber", quantity: "1/2" },
          { name: "Lemon juice", quantity: "1 tbsp" }
        ],
        recipe: [
          "Cook quinoa according to package instructions.",
          "Rinse chickpeas and chop cucumber.",
          "Mix all ingredients in a bowl.",
          "Drizzle with lemon juice and serve."
        ]
      },
      {
        id: 3,
        name: "Grilled Salmon with Asparagus",
        type: "dinner",
        calories: 500,
        protein: 35,
        carbs: 10,
        fats: 25,
        diet: ["non_veg"],
        allergies: [],
        imageSeed: "photo-1467003909585-2f8a72700288",
        ingredients: [
          { name: "Salmon fillet", quantity: "150g" },
          { name: "Asparagus", quantity: "1 bunch" },
          { name: "Olive oil", quantity: "1 tbsp" },
          { name: "Lemon", quantity: "1/2" }
        ],
        recipe: [
          "Preheat grill to medium-high heat.",
          "Brush salmon and asparagus with olive oil.",
          "Grill salmon for 4-5 minutes per side.",
          "Grill asparagus for 3-4 minutes until tender.",
          "Serve with a squeeze of lemon."
        ]
      },
      {
        id: 4,
        name: "Greek Yogurt with Berries",
        type: "snack",
        calories: 200,
        protein: 12,
        carbs: 20,
        fats: 5,
        diet: ["veg", "eggetarian"],
        allergies: ["dairy"],
        imageSeed: "photo-1488477181946-6428a0291777",
        ingredients: [
          { name: "Greek yogurt", quantity: "1 cup" },
          { name: "Mixed berries", quantity: "1/2 cup" },
          { name: "Honey", quantity: "1 tsp" }
        ],
        recipe: [
          "Place yogurt in a bowl.",
          "Top with fresh berries.",
          "Drizzle with honey and enjoy."
        ]
      }
    ];

    // Filter based on diet and allergies
    const filteredMeals = allMeals.filter(meal => {
      const matchesDiet = meal.diet.includes(diet);
      const hasAllergy = meal.allergies.some(a => allergyList.includes(a));
      return matchesDiet && !hasAllergy;
    });

    res.json(filteredMeals);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
