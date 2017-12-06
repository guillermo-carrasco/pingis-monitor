/* Notion detection for a pingpong table. How does it work? If there has been movement for at least 70% of the
   time during the last X seconds (20 on this case), consider the table as busy. Consider it free otherwise. The
   number of mesures is 10, so 1 mesure every 2 seconds in this case. This is to paliate the sensor delay
*/
#define SENSOR_INPUT A0
#define BUSY D4
#define FREE D0
#define BUTTON_RED D7
#define BUTTON_WHITE D6
#define PRESSED LOW
#define NUM_MESUREMENTS 10
#define PERCENT_TO_BUSY 7
#define MESUREMENT_DELAY 2000

bool IS_BUSY = false;
unsigned int motionInTime[NUM_MESUREMENTS];
long doMesure = 0;

// Buttons logic/helpers
bool red_pressed = false;
bool white_pressed = false;
int redCounter = 0;
int whiteCounter = 0;

void setup() {
    // Initialize pins
    pinMode(SENSOR_INPUT, INPUT);
    pinMode(BUTTON_RED, INPUT_PULLUP);
    pinMode(BUTTON_WHITE, INPUT_PULLUP);
    pinMode(BUSY, OUTPUT);
    pinMode(FREE, OUTPUT);
    digitalWrite(FREE,HIGH);

    doMesure = millis() + MESUREMENT_DELAY;

    // Set movement vector to 0 (free)
    for (int i=0; i<NUM_MESUREMENTS; i++)
        motionInTime[i] = 0;
}

void loop() {
    // take mesurements every 2 seconds only, but don't block the main thread with a delay
    if (doMesure <= millis()) {
        int val = digitalRead(SENSOR_INPUT);
        shiftAndAppend(val);
        int percent = numberOfPositives();

        setIsBusy(percent);
        doMesure = millis() + MESUREMENT_DELAY;
    }
    checkButtons();
}


/* Check if the button is pressed and increase counters. Avoid long-press errors by checking previous state
*/
void checkButtons() {
    int val_red = digitalRead(BUTTON_RED);
    int val_white = digitalRead(BUTTON_WHITE);

    // If one of the buttons is pressed, delay for half a second and check the other button. this
    // is for checking if both buttons are pressed "at the same time"
    if (val_red == PRESSED) {
        delay(500);
        val_white = digitalRead(BUTTON_WHITE);
    }
    else if (val_white == PRESSED) {
        delay(500);
        val_red = digitalRead(BUTTON_RED);
    }

    if (val_red == PRESSED and val_white == PRESSED and !red_pressed and !white_pressed) {
        resetCounters();
    }
    else {
        if (val_red == PRESSED and !red_pressed) {
            setRedCounter(redCounter+1);
        }
        if (val_white == PRESSED and !white_pressed) {
            setWhiteCounter(whiteCounter+1);
        }
    }
    red_pressed = (val_red == PRESSED);
    white_pressed = (val_white == PRESSED);
}


/* Set Red counter to a specific value and publish a message
*/
void setRedCounter(int val) {
    redCounter = val;
    Particle.publish("RedCounter", String(val));
}


/* Set White counter to a specific value and publish a message
*/
void setWhiteCounter(int val) {
    whiteCounter = val;
    Particle.publish("WhiteCounter", String(val));
}


void resetCounters() {
    redCounter = whiteCounter = 0;
    Particle.publish("RedCounter", "0");
    Particle.publish("WhiteCounter", "0");
}


/* Set leds accordingly if the table is busy or free
*/
void setIsBusy(int percent) {
    if (percent < PERCENT_TO_BUSY) {
        sendStatus(false);
        digitalWrite(FREE, HIGH);
        digitalWrite(BUSY, LOW);
    } else {
        sendStatus(true);
        digitalWrite(BUSY, HIGH);
        digitalWrite(FREE, LOW);
    }
}


/* Publish status change
*/
void sendStatus(bool busy){
    if(busy && !IS_BUSY) {
        IS_BUSY = true;
        Particle.publish("TableStatus","Busy");
    }
    else if(!busy && IS_BUSY) {
        IS_BUSY = false;
        Particle.publish("TableStatus","Free");
        resetCounters();
    }
}


/* Count number of 1's in an array
*/
int numberOfPositives() {
    // TODO: Improve performance: http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetNaive
    int movement = 0;
    for (int i=0; i<NUM_MESUREMENTS; i++)
        if (motionInTime[i] == 1)
            movement++;
    return movement;
}


/* Shift left the values of an array of ints and append the passed value to the end
*/
void shiftAndAppend(int val) {
    for (int i=0; i<NUM_MESUREMENTS - 1; i++)
        motionInTime[i] = motionInTime[i+1];
    motionInTime[NUM_MESUREMENTS - 1] = val;
}
