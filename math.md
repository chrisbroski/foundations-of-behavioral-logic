Mathematics of Behavioral Logic
===============================

## Data Structures

Some data can be represented by whatever is appropriate. For example, sensor data and action type and parameters. Most behavioral logic data will need to be in a specific configuration, which I will define here using what I hope are the simplest examples. In your own implementation, please make improvements in readability and optimizations.

### Detection

Type: `Boolean`

A detection is an output of a process with an input of sensory data and an output of a true/false value representing the existence a particular state.

I keep wondering if there shouldn't be 3 output states, with *unknown* as a possible third value. I am certain the this is not logically necessary. If we wanted to know if detector D is confidently true or false, two detectors could be used that D1 would only register true if the state confidently exists and D2 is true if the state confidently does not exist. Both reading false would then be logically equivalent to *unknown*. However, adding *unknown* to valid output data could offer significant improvements in clarity to human programmers and conciseness of data. Let's keep this in mind, but not move forward until we are certain.

### Situation

Type: Collection of detections

A situation is an organized collection of detections. The simplest representation would be an an ordered list of detections. Let's say we have 2 detectors: D and E. The output of all being true could be represented symbolically as a binary word:

    11

When dealing with a large amount of detectors, improvements in readability and optimizations should be added. For example, maintaining a key of descriptions of a detector associated to the position of its output in a situation.

### Behavior Table

Type: relational table of situations and actions

A behavior table is a collection of pairs of data with a single situation relating to an action. If the creature has 2 possible action, A and B, its behavior table could be written in JSON as:

    {
        "00": "",
        "01": "A",
        "10": "B",
        "11": "A"
    }

If represented as relational data, the table should have 2 columns named *situation* and *action*, with the situation column as the primary key.

### Feelings

Type: floating-point decimal

Regular, objective senses can output any type of data. Subjective senses (feelings) need to be more rigidly defined. They are meant to represent benefit and harm to the creature (odds of accomplishing or failing the primary goal) so they consistency in order to properly combine and be assessed.

The standard representation of a feeling should be a decimal number between -1.0 and 1.0. negative numbers indicate pain and positive, pleasure.

### Opinions

Type: Table of situations and feelings

Opinions are a table of situations and their associated aggregate feeling.

    {
        "00":  0.0,
        "01":  0.1,
        "10": -0.2,
        "11":  0.5
    }

Like a behavior table, if represented as relational data, the *situation* column should be the primary key.

### Tunable

Type: any scalar, though probably floating-point decimal

A tunable value is any single scalar value that is labelled to be changed. The initial value could be a guess or a value with some certainty. I recommend all tunable values be stored in a data structure to keep magic numbers out of the code.

### Blurry Tunable

Type: tuple of 2 floating-point decimals

Blurry tunables are represented by 2 decimal values: a mean and a standard deviation.

### Beliefs

Type: Table of an initial situation, an action, and a consequent situation.

[
    ["00",  "", "00"],
    ["00", "A", "00"],
    ["00", "B", "00"],
    ["01",  "", "00"],
    ["01", "A", "01"],
    ["01", "B", "01"],
    ["10",  "", "00"],
    ["10", "A", "00"],
    ["10", "B", "01"],
    ["11",  "", "10"],
    ["11", "A", "10"],
    ["11", "B", "01"]
]

The primary key of relational data should be a composite of the initial situation and action.

## Functions

There are processes that are meant to work on the documented data structures.

### Perform

Performing a behavior is as simple as using situation data to retrieve its associated action.

### Aggregate Feelings

Evaluation the subjective quality of a situation requires the combination of output from multiple subjective sensors. We need to the output to be a valid feeling (value between -1.0 and 1.0) so we cannot rely on simple addition. Here is a recursive function that gives reasonable results.

First, separate the positive and negative values into collections of pleasurable and painful feelings, respectively. Then sort each by absolute value, descending.

    pleasure.sort(function (a, b) {
        return b - a;
    });

    pain.sort(function (a, b) {
        return Math.abs(b) - Math.abs(a);
    });

Each value should be added together one at a time, in order, weighted by the difference between the running total and 1.0 (the maximum value.)

    pleasure.reduce(function (acc, current_value) {
        return current_value * (1.0 - acc) + acc;
    }, 0.0);

    pain.reduce(function (acc, current_value) {
        return Math.abs(current_value) * (1.0 - acc) + acc;
    }, 0.0);

The final value is simply the aggregate pleasure minus the aggregate pain.

    feelings = pleasure - pain;

### Judge

Judging a situation as is simple as performing an action. Simply return the feeling value for the respective situation.

### Blurry Tunable Value

The actual value of a blurry is calculated at the time it is needed by multiplying a random standard-normally distributed number (I like to use the Box-Mueller algorithm) by the blurry's standard deviation and adding its mean.

### Tuning Blurries

Oh god, oh god we're all gonna die.

### Simulation

Input is the initial situation and proposed action. Output is the consequent simulation.

### Thought

This is the big one!
