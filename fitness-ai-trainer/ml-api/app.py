from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import re

app = Flask(__name__)

# Configure CORS to allow requests from http://localhost:3000
CORS(app, resources={r"/generate": {"origins": "http://localhost:3000"}})

# Load the fine-tuned model and tokenizer
model = GPT2LMHeadModel.from_pretrained('/Users/isamkhan/Desktop/Fitness-AI-app/fitness-ai-trainer/ml-model/fine-tuned-model')
tokenizer = GPT2Tokenizer.from_pretrained('/Users/isamkhan/Desktop/Fitness-AI-app/fitness-ai-trainer/ml-model/fine-tuned-model')

# Ensure the tokenizer has a padding token
tokenizer.pad_token = tokenizer.eos_token

# Define muscle group to exercise mappings for validation (used for non-Cardio plans)
MUSCLE_GROUP_EXERCISES = {
    'shoulders': ['arm circles', 'dumbbell lateral raises', 'dumbbell shoulder press', 'overhead press', 'pike push-ups'],
    'back': ['superman holds', 'dumbbell rows', 'pull-ups', 'barbell rows', 'weighted pull-ups', 'resistance band rows', 'dumbbell reverse flys'],
    'chest': ['push-ups', 'bench press'],
    'biceps': ['bicep curls', 'barbell curls', 'hammer curls', 'weighted chin-ups'],
    'triceps': ['tricep dips', 'overhead tricep extensions', 'weighted tricep dips', 'close-grip bench press', 'tricep extensions'],
    'abs': ['plank holds', 'bicycle crunches', 'hanging leg raises', 'weighted decline sit-ups', 'russian twists', 'weighted planks'],
    'quads': ['bodyweight squats', 'lunges', 'squats', 'leg press', 'leg extensions', 'walking', 'jogging', 'cycling', 'running'],
    'thighs': ['bodyweight squats', 'lunges', 'squats', 'leg press', 'leg extensions', 'deadlifts', 'romanian deadlifts', 'walking', 'jogging', 'cycling', 'running'],
    'calves': ['calf raises', 'seated calf raises', 'standing calf raises', 'walking', 'jogging', 'cycling', 'running']
}

# Define default plans for each goal
DEFAULT_PLANS = {
    'cardio': {
        'low': "Cardio: 30 minutes of brisk walking 4 times per week. Cardio: 20 minutes of brisk walking at a steady pace. Warm-up: 5 minutes of light stretching. Cool-down: 5 minutes of walking at a slower pace. Note: Walking engages quads, thighs, and calves.",
        'medium': "Cardio: 45 minutes of jogging or cycling 4 times a week. Warm-up: 5 minutes of dynamic stretches (e.g., leg swings, arm circles). Main: 35 minutes of jogging or cycling at a moderate pace. Cool-down: 5 minutes of walking and static stretches. Note: Jogging/cycling engages quads, thighs, and calves.",
        'high': "Cardio: 60 minutes of running and HIIT 5 times a week. Warm-up: 10 minutes of dynamic stretches (e.g., high knees, butt kicks). Main: 40 minutes of running (20 minutes steady pace, 20 minutes HIIT—30 seconds sprint, 30 seconds jog, repeat). Cool-down: 10 minutes of walking and deep stretching. Note: Running engages quads, thighs, and calves."
    },
    'muscle gain': {
        'low': "Muscle Gain: 30 minutes of light weightlifting and isolation exercises 4 times per week. Upper Body: Shoulders - Dumbbell lateral raises (3 sets of 12 reps, push); Back - Dumbbell reverse flys (3 sets of 12 reps, pull); Chest - Push-ups (3 sets of 12 reps, push); Arms - Bicep curls (3 sets of 12 reps, pull), Tricep extensions (3 sets of 12 reps, push); Abs - Plank holds (3 sets of 30 seconds). Lower Body: Quads/Thighs - Leg press (3 sets of 12 reps, push); Calves - Calf raises (3 sets of 15 reps).",
        'medium': "Muscle Gain: 45 minutes of moderate weightlifting and compound exercises 4 times a week. Upper Body: Shoulders - Overhead press (4 sets of 8 reps, push); Back - Pull-ups (4 sets of 8 reps, pull); Chest - Bench press (4 sets of 8 reps, push); Arms - Barbell curls (4 sets of 10 reps, pull), Tricep dips (4 sets of 10 reps, push); Abs - Hanging leg raises (4 sets of 12 reps). Lower Body: Quads/Thighs - Deadlifts (4 sets of 8 reps, pull), Leg extensions (4 sets of 10 reps, push); Calves - Seated calf raises (4 sets of 12 reps).",
        'high': "Muscle Gain: 60 minutes of heavy weightlifting and progressive overload 5 times a week. Upper Body: Shoulders - Barbell overhead press (5 sets of 5 reps, push); Back - Barbell rows (5 sets of 5 reps, pull); Chest - Bench press (5 sets of 5 reps, push); Arms - Weighted chin-ups (5 sets of 5 reps, pull), Weighted tricep dips (5 sets of 5 reps, push); Abs - Weighted decline sit-ups (5 sets of 10 reps). Lower Body: Quads/Thighs - Squats (5 sets of 5 reps, push), Romanian deadlifts (5 sets of 5 reps, pull); Calves - Standing calf raises with heavy weight (5 sets of 10 reps)."
    },
    'strength training': {
        'low': "Strength Training: 30 minutes of bodyweight exercises 4 times per week. Upper Body: Shoulders - Pike push-ups (3 sets of 10 reps, push); Back - Superman holds (3 sets of 30 seconds, pull); Chest - Push-ups (3 sets of 10 reps, push); Arms - Bicep curls with light resistance band (3 sets of 12 reps, pull), Tricep dips on chair (3 sets of 12 reps, push); Abs - Plank holds (3 sets of 30 seconds). Lower Body: Quads/Thighs - Bodyweight squats (3 sets of 15 reps, push); Calves - Calf raises (3 sets of 15 reps).",
        'medium': "Strength Training: 45 minutes of weightlifting with moderate weights 4 times a week. Upper Body: Shoulders - Dumbbell shoulder press (4 sets of 8 reps, push); Back - Dumbbell rows (4 sets of 10 reps, pull); Chest - Bench press (4 sets of 8 reps, push); Arms - Hammer curls (4 sets of 10 reps, pull), Overhead tricep extensions (4 sets of 10 reps, push); Abs - Russian twists with weight (4 sets of 15 reps per side). Lower Body: Quads/Thighs - Deadlifts (4 sets of 8 reps, pull), Leg press (4 sets of 10 reps, push); Calves - Seated calf raises (4 sets of 12 reps).",
        'high': "Strength Training: 60 minutes of heavy weightlifting and compound exercises 5 times a week. Upper Body: Shoulders - Overhead press (5 sets of 5 reps, push); Back - Weighted pull-ups (5 sets of 5 reps, pull); Chest - Bench press (5 sets of 5 reps, push); Arms - Barbell curls (5 sets of 5 reps, pull), Close-grip bench press (5 sets of 5 reps, push); Abs - Weighted planks (5 sets of 45 seconds). Lower Body: Quads/Thighs - Squats (5 sets of 5 reps, push), Romanian deadlifts (5 sets of 5 reps, pull); Calves - Standing calf raises with heavy weight (5 sets of 10 reps)."
    },
    'weight loss': {
        'low': "Generating a Weight Loss workout plan: 30 minutes of brisk walking or light cycling 4 times per week. Cardio: 20 minutes of brisk walking or light cycling at a steady pace. Warm-up: 5 minutes of light stretching. Cool-down: 5 minutes of walking at a slower pace. Note: Walking/cycling engages quads, thighs, and calves.",
        'medium': " Weight Loss workout plan: 45 minutes of jogging or cycling 4 times a week. Cardio: 30 minutes of jogging or cycling at a moderate pace. Warm-up: 5 minutes of dynamic stretches (e.g., leg swings, arm circles). Cool-down: 5 minutes of walking and static stretches. Note: Jogging/cycling engages quads, thighs, and calves.",
        'high': "Generating a Weight Loss workout plan: 60 minutes of running or intense cycling 5 times a week. Cardio: 40 minutes of running or intense cycling (20 minutes steady, 20 minutes HIIT—30 seconds sprint, 30 seconds jog, repeat). Warm-up: 10 minutes of dynamic stretches (e.g., high knees, butt kicks). Cool-down: 10 minutes of walking and deep stretching. Note: Running/cycling engages quads, thighs, and calves."
    }
}

# Function to validate and correct muscle group assignments
def validate_and_correct_plan(generated_text, goal, intensity):
    # Define expected muscle groups for Upper Body, Lower Body, and standalone sections
    upper_body_groups = ['shoulders', 'back', 'chest', 'biceps', 'triceps']
    lower_body_groups = ['quads', 'thighs', 'calves']
    standalone_groups = ['abs']

    # Split the generated text into sections (e.g., Cardio, Upper Body, Lower Body)
    sections = re.split(r'(Cardio:|Upper Body:|Lower Body:|Abs:)', generated_text)
    corrected_sections = []

    for i in range(len(sections)):
        section = sections[i].strip()
        if not section:
            continue

        # Check if this is a section header
        if section in ['Cardio:', 'Upper Body:', 'Lower Body:', 'Abs:']:
            # For Cardio and Weight Loss goals, only keep the Cardio section with a goal-specific header
            if goal.lower() in ['cardio', 'weight loss']:
                if section != 'Cardio:':
                    continue  # Skip non-Cardio sections entirely
                # Use a goal-specific header
                if goal.lower() == 'cardio':
                    corrected_sections.append('Cardio:')
                else:  # weight loss
                    corrected_sections.append(f"Generating a {goal} workout plan:")
                if i + 1 < len(sections):
                    content = sections[i + 1].strip()
                    if not content:
                        continue
                    # Ensure Cardio section includes a cardio activity
                    cardio_keywords = ['walking', 'jogging', 'cycling', 'running', 'hiit', 'sprint']
                    if not any(keyword in content.lower() for keyword in cardio_keywords):
                        content = "20 minutes of brisk walking at a steady pace."
                    corrected_sections.append(content)
            else:
                # For Muscle Gain and Strength Training, process all sections
                corrected_sections.append(section)
                if i + 1 < len(sections):
                    content = sections[i + 1].strip()
                    if not content:
                        continue

                    if section == 'Upper Body:':
                        # Split content into muscle group assignments (e.g., Shoulders: ..., Back: ...)
                        assignments = re.split(r'(Shoulders:|Back:|Chest:|Biceps:|Triceps:)', content)
                        corrected_assignments = []
                        for j in range(len(assignments)):
                            part = assignments[j].strip()
                            if part in ['Shoulders:', 'Back:', 'Chest:', 'Biceps:', 'Triceps:']:
                                muscle_group = part.replace(':', '').lower()
                                if muscle_group not in upper_body_groups:
                                    continue  # Skip if not an upper body muscle group
                                corrected_assignments.append(part)
                                if j + 1 < len(assignments):
                                    exercise = assignments[j + 1].strip()
                                    # Validate the exercise
                                    if not any(ex.lower() in exercise.lower() for ex in MUSCLE_GROUP_EXERCISES[muscle_group]):
                                        # Replace with a default exercise for this muscle group
                                        default_exercise = MUSCLE_GROUP_EXERCISES[muscle_group][0]
                                        if muscle_group == 'shoulders':
                                            exercise = f"{default_exercise} (2 sets of 15 reps)"
                                        elif muscle_group == 'back':
                                            exercise = f"{default_exercise} (2 sets of 20 seconds, pull)"
                                        else:
                                            exercise = f"{default_exercise} (2 sets of 10 reps, {'push' if muscle_group in ['chest', 'triceps'] else 'pull'})"
                                    corrected_assignments.append(exercise)
                            else:
                                corrected_assignments.append(part)
                        corrected_sections.append(' '.join(corrected_assignments))

                    elif section == 'Lower Body:':
                        # Split content into muscle group assignments (e.g., Quads/Thighs: ..., Calves: ...)
                        assignments = re.split(r'(Quads/Thighs:|Calves:)', content)
                        corrected_assignments = []
                        for j in range(len(assignments)):
                            part = assignments[j].strip()
                            if part in ['Quads/Thighs:', 'Calves:']:
                                muscle_group = part.replace(':', '').lower().replace('quads/thighs', 'quads')
                                if muscle_group not in lower_body_groups:
                                    continue  # Skip if not a lower body muscle group
                                corrected_assignments.append(part)
                                if j + 1 < len(assignments):
                                    exercise = assignments[j + 1].strip()
                                    # Validate the exercise
                                    if not any(ex.lower() in exercise.lower() for ex in MUSCLE_GROUP_EXERCISES[muscle_group]):
                                        # Replace with a default exercise for this muscle group
                                        default_exercise = MUSCLE_GROUP_EXERCISES[muscle_group][0]
                                        exercise = f"{default_exercise} (2 sets of 15 reps, push)"
                                    corrected_assignments.append(exercise)
                            else:
                                corrected_assignments.append(part)
                        corrected_sections.append(' '.join(corrected_assignments))

                    elif section == 'Abs:':
                        # Validate the Abs exercise
                        if not any(ex.lower() in content.lower() for ex in MUSCLE_GROUP_EXERCISES['abs']):
                            content = "Plank holds (2 sets of 20 seconds)"
                        corrected_sections.append(content)

                    else:
                        corrected_sections.append(content)
        else:
            corrected_sections.append(section)

    return ' '.join(corrected_sections)

# Function to filter the plan to only include Cardio-related content for Cardio and Weight Loss goals
def filter_cardio_plan(plan, goal):
    if goal.lower() not in ['cardio', 'weight loss']:
        return plan  # Return the full plan for non-Cardio goals

    # Split the plan into sections, accounting for both Cardio: and Generating a Weight Loss workout plan:
    if goal.lower() == 'cardio':
        sections = re.split(r'(Cardio:|Upper Body:|Lower Body:|Abs:)', plan)
    else:  # weight loss
        sections = re.split(r'(Generating a Weight Loss workout plan:|Upper Body:|Lower Body:|Abs:)', plan)

    filtered_sections = []
    in_cardio_section = False

    for i in range(len(sections)):
        section = sections[i].strip()
        if not section:
            continue

        if section in ['Cardio:', ' Weight Loss workout plan:']:
            in_cardio_section = True
            filtered_sections.append(section)
        elif section in ['Upper Body:', 'Lower Body:', 'Abs:']:
            in_cardio_section = False
            continue  # Skip non-Cardio sections
        else:
            # Include the section if it's part of the Cardio section or a note
            if in_cardio_section or section.startswith('Note:'):
                filtered_sections.append(section)

    return ' '.join(filtered_sections)

@app.route('/generate', methods=['POST', 'OPTIONS'])
def generate():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()

    # Get data from the request
    data = request.json
    print("Received data:", data)  # Log the input

    # Validate required fields
    required_fields = ['goal', 'duration', 'intensity']
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields: goal, duration, intensity'}), 400

    # Validate goal
    valid_goals = ['cardio', 'weight loss', 'muscle gain', 'strength training']
    goal = data['goal'].lower()
    if goal not in valid_goals:
        return jsonify({'error': f'Invalid goal. Must be one of: {", ".join(valid_goals)}'}), 400

    # Validate duration (must be a positive integer)
    try:
        duration = int(data['duration'])
        if duration <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'error': 'Duration must be a positive integer'}), 400

    # Validate intensity
    valid_intensities = ['low', 'medium', 'high']
    intensity = data['intensity'].lower()
    if intensity not in valid_intensities:
        return jsonify({'error': f'Invalid intensity. Must be one of: {", ".join(valid_intensities)}'}), 400

    # Create a simpler prompt for the model
    prompt = f"Generate a {goal} workout plan for {duration} times per week at {intensity} intensity."
    print("Generated prompt:", prompt)  # Log the prompt
    
    # Converts the prompt into a format that the GPT-2 model can process.
    inputs = tokenizer(prompt, return_tensors='pt', max_length=512, truncation=True, padding=True)
    
    # Generate workout plan with adjusted parameters
    outputs = model.generate(
        **inputs,
        max_length=400,  # Limits the generated text to 400 tokens (including the prompt).
        num_beams=5,     # Use beam search with 5 beams to improve the quality of the generated text
        temperature=0.7, # Controls the randomness of the output (lower values make the output more focused)
        top_k=50,        # Limit sampling pool to top 50 tokens (reduces randomness)
        top_p=0.9,       # Use nucleus sampling with p=0.9
        no_repeat_ngram_size=2,  # Prevent repeating 2-word sequences improving the output.
        do_sample=True   # Enable sampling for more diverse output
    )
    
    # Decode the generated plan
    plan = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print("Generated plan:", plan)  # Log the generated plan

    # Validate the generated plan for goal-specific focus
    if goal.lower() in ['cardio', 'weight loss']:
        cardio_keywords = ['walking', 'jogging', 'cycling', 'running', 'hiit', 'sprint']
        if not any(keyword in plan.lower() for keyword in cardio_keywords):
            plan = DEFAULT_PLANS[goal.lower()][intensity.lower()]
    elif goal.lower() in ['muscle gain', 'strength training']:
        strength_keywords = ['push-ups', 'bench press', 'squats', 'deadlifts', 'pull-ups', 'curls', 'dips']
        if not any(keyword in plan.lower() for keyword in strength_keywords):
            plan = DEFAULT_PLANS[goal.lower()][intensity.lower()]
    
    # Validate and correct muscle group assignments
    corrected_plan = validate_and_correct_plan(plan, goal, intensity)
    
    # Filter the plan to only include Cardio-related content for Cardio and Weight Loss goals
    filtered_plan = filter_cardio_plan(corrected_plan, goal)
    
    # Ensure the filtered plan still meets the goal-specific criteria
    if goal.lower() in ['cardio', 'weight loss']:
        cardio_keywords = ['walking', 'jogging', 'cycling', 'running', 'hiit', 'sprint']
        if not any(keyword in filtered_plan.lower() for keyword in cardio_keywords):
            filtered_plan = DEFAULT_PLANS[goal.lower()][intensity.lower()]
    elif goal.lower() in ['muscle gain', 'strength training']:
        strength_keywords = ['push-ups', 'bench press', 'squats', 'deadlifts', 'pull-ups', 'curls', 'dips']
        if not any(keyword in filtered_plan.lower() for keyword in strength_keywords):
            filtered_plan = DEFAULT_PLANS[goal.lower()][intensity.lower()]
    
    print("Filtered plan:", filtered_plan)  # Log the filtered plan
   
    # Return the generated plan with CORS headers
    response = jsonify({'plan': filtered_plan})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

def _build_cors_preflight_response():
    response = jsonify({})
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)