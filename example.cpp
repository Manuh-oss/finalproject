#include <iostream>
using namespace std;

class Car {
private:
    string brand;
    int year;

public:
    // Setter (sets values)
    void setBrand(string b) {
        brand = b;
    }

    void setYear(int y) {
        if (y > 1885) {  // First car was made in 1886
            year = y;
        } else {
            cout << "Invalid year!" << endl;
        }
    }

    // Getter (gets values)
    string getBrand() {
        return brand;
    }

    int getYear() {
        return year;
    }
};

int main() {
    Car myCar;

    // Using setters to assign values
    myCar.setBrand("Toyota");
    myCar.setYear(2022);

    // Using getters to retrieve values
    cout << "Car Brand: " << myCar.getBrand() << endl;
    cout << "Car Year: " << myCar.getYear() << endl;

    return 0;
}
