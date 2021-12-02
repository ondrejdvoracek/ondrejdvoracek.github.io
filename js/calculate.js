var app = new Vue({
    el: "#app",
    data: {
        moisture_content: 0,
        cutting_fibre_angle: 0,
        cutting_velocity: 5,
        density: 600,
        uncut_chip_thickness: 0.01,
        cutting_width: 1,
        cutting_force: "",
    },
    created() {
        this.calculate_cutting_force();
    },
    updated() {
        this.calculate_cutting_force();
    },
    methods: {
        calculate_cutting_force: function() {
            // Create local copies of the variables.
            // This is done to avoid potential conflicts.
            var moisture_content;
            var cutting_fibre_angle;
            var cutting_velocity;
            var density;
            var uncut_chip_thickness;
            var cutting_width;

            // Moisture content.
            if (this.moisture_content >= 32) {
                moisture_content = 32;
            } else if (this.moisture_content <= 0) {
                moisture_content = 0;
            } else {
                moisture_content = this.moisture_content;
            }

            // Cutting fibre angle.
            if (this.cutting_fibre_angle >= 90) {
                cutting_fibre_angle = 90;
            } else if (this.cutting_fibre_angle <= 0) {
                cutting_fibre_angle = 0;
            } else {
                cutting_fibre_angle = this.cutting_fibre_angle;
            }

            // Cutting velocity.
            if (this.cutting_velocity >= 80) {
                cutting_velocity = 80;
            } else if (this.cutting_velocity <= 5) {
                cutting_velocity = 5;
            } else {
                cutting_velocity = this.cutting_velocity;
            }

            // Density.
            if (this.density >= 800) {
                density = 800;
            } else if (this.density <= 600) {
                density = 600;
            } else {
                density = this.density;
            }

            //Uncut chip thickness.
            if (this.uncut_chip_thickness >= 0.6) {
                uncut_chip_thickness = 0.6;
            } else if (this.uncut_chip_thickness <= 0.01) {
                uncut_chip_thickness = 0.01;
            } else {
                uncut_chip_thickness = this.uncut_chip_thickness;
            }

            // Cutting width.
            if (this.cutting_width >= 30) {
                cutting_width = 30;
            } else if (this.cutting_width <= 1) {
                cutting_width = 1;
            } else {
                cutting_width = this.cutting_width;
            }

            // Just make sure they are numbers.
            moisture_content = Number(moisture_content);
            cutting_fibre_angle = Number(cutting_fibre_angle);
            cutting_velocity = Number(cutting_velocity);
            density = Number(density);
            uncut_chip_thickness = Number(uncut_chip_thickness);
            cutting_width = Number(cutting_width);

            // Get the parameters from the form.
            // Conversion (Ondrej's model parameters).
            A = moisture_content;
            B = cutting_fibre_angle;
            C = cutting_velocity;
            D = uncut_chip_thickness;

            // Model for MC, FA and velocity.
            spec_force_1 =
                7.04211 +
                -0.062299 * A +
                0.2274 * B +
                -0.121388 * C +
                0.0109825 * A * B +
                0.00195076 * A * C +
                0.0109557 * A * A +
                -0.00783311 * B * B +
                0.00316762 * C * C +
                -0.00082294 * A * A * B +
                -3.59108e-6 * A * B * B +
                -2.78869e-5 * A * C * C +
                -0.000336306 * A * A * A +
                0.000125868 * B * B * B +
                -1.54863e-5 * C * C * C +
                3.40928e-6 * A * A * B * B +
                1.12721e-5 * A * A * A * B +
                -7.58739e-7 * A * B * B * B +
                -6.25039e-7 * B * B * B * B;

            // Model for MC, chip thickness and velocity.
            spec_force_2 =
                2.91501 +
                0.0835908 * A +
                -0.102696 * C +
                -8.37811 * D +
                -0.00468327 * A * C +
                1.24946 * A * D +
                -0.281406 * C * D +
                -8.99271e-5 * A * A +
                0.00428216 * C * C +
                133.088 * D * D +
                0.0111487 * A * C * D +
                7.80567e-5 * A * A * C +
                -0.0515569 * A * A * D +
                -1.14786 * A * D * D +
                0.00630141 * C * C * D +
                -0.430491 * C * D * D +
                -3.52967e-5 * C * C * C +
                -59.5688 * D * D * D;

            // Model for given MC and velocity but fixed chip thickness of 0.2 mm.
            spec_force_3 =
                2.91501 +
                0.0835908 * A +
                -0.102696 * C +
                -8.37811 * 0.2 +
                -0.00468327 * A * C +
                1.24946 * A * 0.2 +
                -0.281406 * C * 0.2 +
                -8.99271e-5 * A * A +
                0.00428216 * C * C +
                133.088 * 0.2 * 0.2 +
                0.0111487 * A * C * 0.2 +
                7.80567e-5 * A * A * C +
                -0.0515569 * A * A * 0.2 +
                -1.14786 * A * 0.2 * 0.2 +
                0.00630141 * C * C * 0.2 +
                -0.430491 * C * 0.2 * 0.2 +
                -3.52967e-5 * C * C * C +
                -59.5688 * 0.2 * 0.2 * 0.2;

            // Complete model.
            cutting_force =
                (spec_force_1 +
                    spec_force_2 -
                    spec_force_3 +
                    (-645.19 + density) * (0.3037 / 20)) *
                cutting_width;

            // Round to one decimal place and set it.
            this.cutting_force = cutting_force.toFixed(1);
        },
    },
});